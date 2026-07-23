from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends, status, UploadFile, File, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import jwt
import bcrypt
import logging
import smtplib
import asyncio
import ssl
import uuid
import requests
from email.message import EmailMessage
from pathlib import Path
from pydantic import BaseModel, Field, BeforeValidator
from typing import List, Optional, Annotated, Any
from datetime import datetime, timezone, timedelta
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Auth configurations
JWT_SECRET = os.environ.get("JWT_SECRET", "df7f33d7b89569ba43ec68ea1df86a7ffdf8f3a38d2f5a894626ff82d4eb7df9")
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@fatimahospital.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "FatimaAdmin2026!")

# Email (Gmail SMTP) configuration
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
FROM_EMAIL = os.environ.get("FROM_EMAIL", SMTP_USER)
HOSPITAL_NOTIFY_EMAIL = os.environ.get("HOSPITAL_NOTIFY_EMAIL", SMTP_USER)
HOSPITAL_NAME = "Fatima Multispeciality Hospital"

# Object storage (Emergent) configuration
STORAGE_URL = "http://localhost"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
APP_NAME = "fatima-hospital"
MIME_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "gif": "image/gif", "webp": "image/webp"}
_storage_key = None

def init_storage():
    global _storage_key
    if _storage_key:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120
    )
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

def _send_email_sync(to_email: str, subject: str, html_body: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP not configured; skipping email send.")
        return False
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{HOSPITAL_NAME} <{FROM_EMAIL}>"
    msg["To"] = to_email
    msg.set_content("This email requires an HTML-capable client.")
    msg.add_alternative(html_body, subtype="html")
    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.starttls(context=context)
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
    return True

async def send_email(to_email: str, subject: str, html_body: str):
    """Send an email without breaking the request if delivery fails."""
    try:
        sent = await asyncio.to_thread(_send_email_sync, to_email, subject, html_body)
        if sent:
            logger.info(f"EMAIL SENT to {to_email}: {subject}")
        return sent
    except Exception as e:
        logger.error(f"EMAIL FAILED to {to_email} ({subject}): {e}")
        return False

def _email_shell(title: str, body_html: str) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden">
      <div style="background:#0D8B6F;padding:24px;text-align:center;color:#fff">
        <h1 style="margin:0;font-size:20px">{HOSPITAL_NAME}</h1>
        <p style="margin:4px 0 0;font-size:12px;opacity:.9">Aapki Sehat. Aapka Parivaar. Hamara Vaada.</p>
      </div>
      <div style="padding:28px;color:#1F2937">
        <h2 style="color:#0D8B6F;font-size:18px;margin-top:0">{title}</h2>
        {body_html}
      </div>
      <div style="background:#F8FAFB;padding:16px 28px;color:#6B7280;font-size:12px">
        <p style="margin:0">Okhla, Jamia Nagar, South Delhi, New Delhi - 110025</p>
        <p style="margin:4px 0 0">Emergency: 011-41675390 &bull; +91 9310244959</p>
      </div>
    </div>
    """

# Pydantic MongoDB adherence Setup
PyObjectId = Annotated[str, BeforeValidator(str)]

class BaseDocument(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

    @classmethod
    def from_mongo(cls, data: dict):
        if not data:
            return None
        return cls(**data)

    def to_mongo(self, exclude_none: bool = True) -> dict:
        data = self.model_dump(by_alias=True, exclude_none=exclude_none)
        if "id" in data:
            data["_id"] = data.pop("id")
        if "_id" in data and isinstance(data["_id"], str) and ObjectId.is_valid(data["_id"]):
            data["_id"] = ObjectId(data["_id"])
        return data

# Database Schemas
class UserInDB(BaseDocument):
    email: str
    password_hash: str
    name: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class Doctor(BaseDocument):
    name: str
    qualification: str
    specialization: str
    experience_years: int
    photo_url: str
    availability: str = "9:00 AM - 5:00 PM"
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Appointment(BaseDocument):
    name: str
    phone: str
    email: str
    department: str
    doctor_id: Optional[str] = None
    preferred_date: str
    message: Optional[str] = ""
    status: str = "Pending"  # Pending, Confirmed, Cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Blog(BaseDocument):
    title: str
    slug: str
    category: str
    summary: str
    content: str
    author: str = "Fatima Medical Editorial"
    read_time: str = "5 mins"
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    tags: List[str] = []

class Enquiry(BaseDocument):
    name: str
    phone: str
    email: str
    subject: Optional[str] = "General Enquiry"
    message: str
    status: str = "New"  # New, In Progress, Resolved
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Media(BaseDocument):
    title: str
    media_type: str = "image"  # image | youtube
    url: str
    category: str = "Gallery"  # Gallery | Hero | Infrastructure | Other
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TeamMember(BaseDocument):
    name: str
    role: str
    photo_url: Optional[str] = ""
    bio: Optional[str] = ""
    youtube_url: Optional[str] = ""
    is_founder: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper functions
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60), # Expanded for developer convenience & testing
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# Current User Dependency
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        
        user_id = payload.get("sub")
        if not user_id or not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
            
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Brute force protection
async def check_brute_force(ip: str, email: str):
    identifier = f"{ip}:{email.lower().strip()}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt:
        attempts = attempt.get("attempts", 0)
        last_attempt = attempt.get("last_attempt")
        if isinstance(last_attempt, str):
            last_attempt = datetime.fromisoformat(last_attempt)
        
        if attempts >= 5:
            time_passed = datetime.now(timezone.utc) - last_attempt
            if time_passed < timedelta(minutes=15):
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many failed attempts. Locked out for 15 minutes."
                )
            else:
                # Expired lockout, reset
                await db.login_attempts.delete_one({"identifier": identifier})

async def record_login_attempt(ip: str, email: str, success: bool):
    identifier = f"{ip}:{email.lower().strip()}"
    if success:
        await db.login_attempts.delete_one({"identifier": identifier})
    else:
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {
                "$inc": {"attempts": 1},
                "$set": {"last_attempt": datetime.now(timezone.utc).isoformat()}
            },
            upsert=True
        )

# Main App setup
app = FastAPI(title="Fatima Multispeciality Hospital API")
api_router = APIRouter(prefix="/api")

# --- AUTH ENDPOINTS ---

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: LoginRequest, request: Request):
    # Standard registration
    email_norm = user_data.email.lower().strip()
    existing = await db.users.find_one({"email": email_norm})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user_data.password)
    user_doc = {
        "email": email_norm,
        "password_hash": hashed,
        "name": email_norm.split('@')[0].capitalize(),
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    
    user_id = str(result.inserted_id)
    access_token = create_access_token(user_id, email_norm)
    refresh_token = create_refresh_token(user_id)
    
    response = JSONResponse(content={
        "id": user_id,
        "email": email_norm,
        "name": user_doc["name"],
        "role": user_doc["role"]
    })
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return response

@api_router.post("/auth/login")
async def login(login_data: LoginRequest, request: Request):
    ip = request.client.host if request.client else "unknown"
    email_norm = login_data.email.lower().strip()
    
    await check_brute_force(ip, email_norm)
    
    user = await db.users.find_one({"email": email_norm})
    if not user or not verify_password(login_data.password, user["password_hash"]):
        await record_login_attempt(ip, email_norm, success=False)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    await record_login_attempt(ip, email_norm, success=True)
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email_norm)
    refresh_token = create_refresh_token(user_id)
    
    response = JSONResponse(content={
        "id": user_id,
        "email": email_norm,
        "name": user.get("name", "Admin"),
        "role": user.get("role", "admin")
    })
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return response

@api_router.post("/auth/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response

@api_router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user

@api_router.post("/auth/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    email_norm = req.email.lower().strip()
    user = await db.users.find_one({"email": email_norm})
    if not user:
        # Avoid user enumeration, pretend it works
        return {"message": "If the email exists, a reset link has been logged"}
    
    import secrets
    token = secrets.token_urlsafe(32)
    expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    
    await db.password_reset_tokens.insert_one({
        "token": token,
        "email": email_norm,
        "expires_at": expiry.isoformat(),
        "used": False
    })
    
    # Log reset link as per playbook
    logger.info(f"PASSWORD RESET LINK FOR {email_norm}: http://localhost:3000/reset-password?token={token}")
    return {"message": "Password reset link logged successfully (simulated/sent)"}

@api_router.post("/auth/reset-password")
async def reset_password(req: ResetPasswordRequest):
    token_doc = await db.password_reset_tokens.find_one({"token": req.token, "used": False})
    if not token_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    expires_at = token_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Expired reset token")
    
    email = token_doc["email"]
    hashed = hash_password(req.new_password)
    
    await db.users.update_one({"email": email}, {"$set": {"password_hash": hashed}})
    await db.password_reset_tokens.update_one({"_id": token_doc["_id"]}, {"$set": {"used": True}})
    
    return {"message": "Password has been reset successfully"}


# --- DOCTORS ENDPOINTS ---

@api_router.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    docs = await db.doctors.find({}).to_list(100)
    return [Doctor.from_mongo(d) for d in docs]

@api_router.post("/doctors", response_model=Doctor)
async def create_doctor(doc: Doctor, current_user: dict = Depends(get_current_user)):
    doc_dict = doc.to_mongo(exclude_none=True)
    doc_dict.pop("_id", None) # Clean up so MongoDB can generate its own ID
    result = await db.doctors.insert_one(doc_dict)
    doc_dict["_id"] = result.inserted_id
    return Doctor.from_mongo(doc_dict)

@api_router.put("/doctors/{id}", response_model=Doctor)
async def update_doctor(id: str, doc_update: Doctor, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid doctor ID")
    
    update_data = doc_update.model_dump(exclude_none=True)
    update_data.pop("id", None)
    update_data.pop("_id", None)
    
    await db.doctors.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    updated = await db.doctors.find_one({"_id": ObjectId(id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return Doctor.from_mongo(updated)

@api_router.delete("/doctors/{id}")
async def delete_doctor(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid doctor ID")
    result = await db.doctors.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"message": "Doctor deleted successfully"}


# --- APPOINTMENTS ENDPOINTS ---

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(app_data: Appointment):
    app_dict = app_data.to_mongo(exclude_none=True)
    app_dict.pop("_id", None)
    app_dict["status"] = "Pending"
    app_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.appointments.insert_one(app_dict)
    app_dict["_id"] = result.inserted_id

    # Acknowledge the patient
    patient_html = _email_shell(
        "We've received your appointment request",
        f"""<p>Dear {app_data.name},</p>
        <p>Thank you for choosing {HOSPITAL_NAME}. We have received your appointment request and our team will contact you shortly to confirm.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#6B7280">Department</td><td style="padding:6px 0;font-weight:bold">{app_data.department}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Preferred Date</td><td style="padding:6px 0;font-weight:bold">{app_data.preferred_date}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Phone</td><td style="padding:6px 0;font-weight:bold">{app_data.phone}</td></tr>
        </table>
        <p>For urgent care, call our 24x7 helpline at <b>011-41675390</b>.</p>"""
    )
    await send_email(app_data.email, f"Appointment Request Received — {HOSPITAL_NAME}", patient_html)

    # Notify the hospital team
    hospital_html = _email_shell(
        "New Appointment Request",
        f"""<p>A new appointment request has been submitted:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#6B7280">Patient</td><td style="padding:6px 0;font-weight:bold">{app_data.name}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Phone</td><td style="padding:6px 0;font-weight:bold">{app_data.phone}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Email</td><td style="padding:6px 0;font-weight:bold">{app_data.email}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Department</td><td style="padding:6px 0;font-weight:bold">{app_data.department}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Preferred Date</td><td style="padding:6px 0;font-weight:bold">{app_data.preferred_date}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Message</td><td style="padding:6px 0">{app_data.message or '—'}</td></tr>
        </table>"""
    )
    await send_email(HOSPITAL_NOTIFY_EMAIL, f"New Appointment: {app_data.name} ({app_data.department})", hospital_html)
    
    return Appointment.from_mongo(app_dict)

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(current_user: dict = Depends(get_current_user)):
    apps = await db.appointments.find({}).sort("created_at", -1).to_list(1000)
    return [Appointment.from_mongo(a) for a in apps]

@api_router.put("/appointments/{id}", response_model=Appointment)
async def update_appointment_status(id: str, update_payload: dict, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid appointment ID")
    
    status_val = update_payload.get("status")
    if not status_val or status_val not in ["Pending", "Confirmed", "Cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
        
    await db.appointments.update_one({"_id": ObjectId(id)}, {"$set": {"status": status_val}})
    updated = await db.appointments.find_one({"_id": ObjectId(id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Communicate status change back to the patient via email
    patient_email = updated.get("email")
    if patient_email and status_val in ("Confirmed", "Cancelled"):
        if status_val == "Confirmed":
            body = _email_shell(
                "Your appointment is confirmed",
                f"""<p>Dear {updated.get('name')},</p>
                <p>Good news! Your appointment at {HOSPITAL_NAME} has been <b style="color:#0D8B6F">confirmed</b>.</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0">
                  <tr><td style="padding:6px 0;color:#6B7280">Department</td><td style="padding:6px 0;font-weight:bold">{updated.get('department')}</td></tr>
                  <tr><td style="padding:6px 0;color:#6B7280">Date</td><td style="padding:6px 0;font-weight:bold">{updated.get('preferred_date')}</td></tr>
                </table>
                <p>Please arrive 15 minutes early and carry any previous medical records. See you soon!</p>"""
            )
            subject = f"Appointment Confirmed — {HOSPITAL_NAME}"
        else:
            body = _email_shell(
                "Update on your appointment request",
                f"""<p>Dear {updated.get('name')},</p>
                <p>We're sorry, but your appointment request for <b>{updated.get('department')}</b> on <b>{updated.get('preferred_date')}</b> could not be scheduled at this time.</p>
                <p>Please call us at <b>011-41675390</b> to reschedule at a convenient time.</p>"""
            )
            subject = f"Appointment Update — {HOSPITAL_NAME}"
        await send_email(patient_email, subject, body)
        
    return Appointment.from_mongo(updated)

@api_router.delete("/appointments/{id}")
async def delete_appointment(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid appointment ID")
    result = await db.appointments.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}


# --- BLOGS ENDPOINTS ---

@api_router.get("/blogs", response_model=List[Blog])
async def get_blogs():
    blogs = await db.blogs.find({}).to_list(100)
    return [Blog.from_mongo(b) for b in blogs]

@api_router.get("/blogs/{id_or_slug}", response_model=Blog)
async def get_blog_detail(id_or_slug: str):
    query = {}
    if ObjectId.is_valid(id_or_slug):
        query = {"_id": ObjectId(id_or_slug)}
    else:
        query = {"slug": id_or_slug}
        
    blog = await db.blogs.find_one(query)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return Blog.from_mongo(blog)

@api_router.post("/blogs", response_model=Blog)
async def create_blog(blog: Blog, current_user: dict = Depends(get_current_user)):
    blog_dict = blog.to_mongo(exclude_none=True)
    blog_dict.pop("_id", None)
    result = await db.blogs.insert_one(blog_dict)
    blog_dict["_id"] = result.inserted_id
    return Blog.from_mongo(blog_dict)

@api_router.put("/blogs/{id}", response_model=Blog)
async def update_blog(id: str, blog_update: Blog, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid blog ID")
    
    update_data = blog_update.model_dump(exclude_none=True)
    update_data.pop("id", None)
    update_data.pop("_id", None)
    
    await db.blogs.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    updated = await db.blogs.find_one({"_id": ObjectId(id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Blog not found")
    return Blog.from_mongo(updated)

@api_router.delete("/blogs/{id}")
async def delete_blog(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid blog ID")
    result = await db.blogs.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}


# --- LEAD / ENQUIRIES ENDPOINTS ---

@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(enq: Enquiry):
    enq_dict = enq.to_mongo(exclude_none=True)
    enq_dict.pop("_id", None)
    enq_dict["status"] = "New"
    enq_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.enquiries.insert_one(enq_dict)
    enq_dict["_id"] = result.inserted_id
    
    hospital_html = _email_shell(
        "New Contact Enquiry / Lead",
        f"""<p>A new enquiry was submitted via the website:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#6B7280">Name</td><td style="padding:6px 0;font-weight:bold">{enq.name}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Phone</td><td style="padding:6px 0;font-weight:bold">{enq.phone}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Email</td><td style="padding:6px 0;font-weight:bold">{enq.email}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Subject</td><td style="padding:6px 0;font-weight:bold">{enq.subject}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Message</td><td style="padding:6px 0">{enq.message}</td></tr>
        </table>"""
    )
    await send_email(HOSPITAL_NOTIFY_EMAIL, f"New Enquiry: {enq.name}", hospital_html)
    return Enquiry.from_mongo(enq_dict)

@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries(current_user: dict = Depends(get_current_user)):
    enquiries = await db.enquiries.find({}).sort("created_at", -1).to_list(1000)
    return [Enquiry.from_mongo(e) for e in enquiries]

@api_router.put("/enquiries/{id}", response_model=Enquiry)
async def update_enquiry_status(id: str, update_payload: dict, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid enquiry ID")
    status_val = update_payload.get("status")
    if not status_val or status_val not in ["New", "In Progress", "Resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
        
    await db.enquiries.update_one({"_id": ObjectId(id)}, {"$set": {"status": status_val}})
    updated = await db.enquiries.find_one({"_id": ObjectId(id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return Enquiry.from_mongo(updated)

@api_router.delete("/enquiries/{id}")
async def delete_enquiry(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid enquiry ID")
    result = await db.enquiries.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Enquiry deleted successfully"}


# --- MEDIA / FILE UPLOAD ENDPOINTS ---

@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "bin"
    content_type = MIME_TYPES.get(ext, file.content_type or "application/octet-stream")
    path = f"{APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
    data = await file.read()
    try:
        result = await asyncio.to_thread(put_object, path, data, content_type)
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail="File upload failed. Please try again.")
    stored_path = result.get("path", path)
    await db.files.insert_one({
        "storage_path": stored_path,
        "original_filename": file.filename,
        "content_type": content_type,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"url": f"/api/files/{stored_path}", "path": stored_path}

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    try:
        data, content_type = await asyncio.to_thread(get_object, path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(content=data, media_type=content_type, headers={"Cache-Control": "public, max-age=86400"})

@api_router.get("/media", response_model=List[Media])
async def get_media():
    items = await db.media.find({}).sort("order", 1).to_list(500)
    return [Media.from_mongo(m) for m in items]

@api_router.post("/media", response_model=Media)
async def create_media(item: Media, current_user: dict = Depends(get_current_user)):
    d = item.to_mongo(exclude_none=True)
    d.pop("_id", None)
    d["created_at"] = datetime.now(timezone.utc).isoformat()
    r = await db.media.insert_one(d)
    d["_id"] = r.inserted_id
    return Media.from_mongo(d)

@api_router.delete("/media/{id}")
async def delete_media(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid media ID")
    r = await db.media.delete_one({"_id": ObjectId(id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Media deleted successfully"}


# --- TEAM / FOUNDER ENDPOINTS ---

@api_router.get("/team", response_model=List[TeamMember])
async def get_team():
    items = await db.team.find({}).sort("order", 1).to_list(200)
    return [TeamMember.from_mongo(t) for t in items]

@api_router.post("/team", response_model=TeamMember)
async def create_team_member(member: TeamMember, current_user: dict = Depends(get_current_user)):
    d = member.to_mongo(exclude_none=True)
    d.pop("_id", None)
    d["created_at"] = datetime.now(timezone.utc).isoformat()
    r = await db.team.insert_one(d)
    d["_id"] = r.inserted_id
    return TeamMember.from_mongo(d)

@api_router.put("/team/{id}", response_model=TeamMember)
async def update_team_member(id: str, member: TeamMember, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid team ID")
    update_data = member.model_dump(exclude_none=True)
    update_data.pop("id", None)
    update_data.pop("_id", None)
    await db.team.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    updated = await db.team.find_one({"_id": ObjectId(id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Team member not found")
    return TeamMember.from_mongo(updated)

@api_router.delete("/team/{id}")
async def delete_team_member(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid team ID")
    r = await db.team.delete_one({"_id": ObjectId(id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted successfully"}


# Seed function and Startup Lifecycle
@app.on_event("startup")
async def startup_db_client():
    # Setup indexes
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")

    # Initialize object storage
    try:
        pass  # storage disabled
        
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    
    # Seed Admin Account
    admin_email_norm = ADMIN_EMAIL.lower().strip()
    admin_exists = await db.users.find_one({"email": admin_email_norm})
    if not admin_exists:
        hashed_pw = hash_password(ADMIN_PASSWORD)
        await db.users.insert_one({
            "email": admin_email_norm,
            "password_hash": hashed_pw,
            "name": "Fatima Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin seeded with email: {admin_email_norm}")
    else:
        # If password in .env changed, update it
        if not verify_password(ADMIN_PASSWORD, admin_exists["password_hash"]):
            await db.users.update_one(
                {"email": admin_email_norm},
                {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}}
            )
            logger.info("Admin password hash updated matching current .env")

    # Seed Doctors if empty
    doctor_count = await db.doctors.count_documents({})
    if doctor_count == 0:
        seed_doctors = [
            {
                "name": "Dr. Farhana Khan",
                "qualification": "MBBS, MD - Obstetrics & Gynaecology",
                "specialization": "Gynaecology & Obstetrics",
                "experience_years": 18,
                "photo_url": "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "availability": "10:00 AM - 2:00 PM (Mon-Sat)",
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Dr. Tariq Mahmood",
                "qualification": "MBBS, MD - Pediatrics",
                "specialization": "Pediatrics & Neonatal Care",
                "experience_years": 15,
                "photo_url": "https://images.pexels.com/photos/3786119/pexels-photo-3786119.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "availability": "11:00 AM - 4:00 PM (Mon-Sat)",
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Dr. S. N. Singh",
                "qualification": "MBBS, MD - General Medicine",
                "specialization": "General Medicine",
                "experience_years": 22,
                "photo_url": "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "availability": "9:00 AM - 1:00 PM, 5:00 PM - 7:00 PM",
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Dr. Amit Sharma",
                "qualification": "MBBS, MS - Orthopaedics",
                "specialization": "Orthopaedics & Joint Replacement",
                "experience_years": 12,
                "photo_url": "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "availability": "2:00 PM - 6:00 PM (Tue, Thu, Sat)",
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "name": "Dr. Asif Ali",
                "qualification": "MBBS, MS - General Surgery",
                "specialization": "General & Laparoscopic Surgery",
                "experience_years": 14,
                "photo_url": "https://images.pexels.com/photos/5998120/pexels-photo-5998120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "availability": "10:00 AM - 3:00 PM (Mon-Fri)",
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.doctors.insert_many(seed_doctors)
        logger.info("Initial list of specialists seeded successfully")

    # Seed Blogs if empty
    blog_count = await db.blogs.count_documents({})
    if blog_count == 0:
        seed_blogs = [
            {
                "title": "Essential First Trimester Tips for New Mothers",
                "slug": "essential-first-trimester-tips",
                "category": "Pregnancy Care",
                "summary": "Nurturing a new life begins with proper self-care. Learn about key nutrition, routines, and checkups for your first trimester.",
                "content": "<p>The first trimester of pregnancy is a time of incredible change, both visible and invisible. Undergoing these transformations, a mother's body requires dedicated care, balanced nourishment, and peaceful surroundings.</p><h4>1. Priority Prenatal Vitamins</h4><p>Starting folic acid and iron supplements immediately is critical to support the infant's neural tube development and prevent early deficiency.</p><h4>2. Managing Morning Sickness</h4><p>Nausea is highly common. Keep meals small, dry, and frequent. Staying hydrated with infused ginger water works wonders.</p><h4>3. Quality Rest</h4><p>Your body is busy building an entirely new life-support system (the placenta). Prioritize 8+ hours of sleep and listen to your body's signs.</p>",
                "author": "Dr. Farhana Khan",
                "read_time": "5 mins",
                "image_url": "https://images.pexels.com/photos/4041804/pexels-photo-4041804.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "tags": ["Pregnancy", "First Trimester", "Maternity Excellence"]
            },
            {
                "title": "Understanding High-Risk Pregnancy: Causes & Care",
                "slug": "understanding-high-risk-pregnancy",
                "category": "Women's Health",
                "summary": "Knowledge is power. Discover what qualifies as a high-risk pregnancy and how Fatima Hospital's advanced labor rooms support you.",
                "content": "<p>A high-risk pregnancy simply means that a woman or her baby needs extra care, monitoring, and specialized support during gestation or delivery.</p><h4>Common Risk Factors</h4><ul><li>Maternal age (under 17 or over 35)</li><li>Pre-existing conditions like hypertension or diabetes</li><li>Multiple births (twins or triplets)</li><li>History of pregnancy complications</li></ul><h4>Fatima Hospital's Protective Care</h4><p>Our pre-labour rooms, advanced labor beds, and 24x7 neonatologists ensure immediate critical care and emergency response when minutes count.</p>",
                "author": "Dr. Farhana Khan",
                "read_time": "7 mins",
                "image_url": "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "tags": ["High Risk", "Maternity", "NICU Support"]
            },
            {
                "title": "Newborn Care Checklist: NICU & Postnatal Support",
                "slug": "newborn-care-checklist-nicu",
                "category": "Child Health",
                "summary": "Bringing your baby home is a joyful milestone. Our pediatric experts outline critical newborn signs and breastfeeding advice.",
                "content": "<p>Welcome to parenthood! The first few weeks of newborn care are filled with questions. Here is our direct medical checklist for post-discharge care.</p><h4>Feeding and Nutrition</h4><p>Exclusive breastfeeding is recommended for the first six months. Establish a quiet feeding routine and track feeding schedules.</p><h4>Monitoring Essential Milestones</h4><p>Pay close attention to infant temperature, stool colors, and activity levels. If your baby was supported by our advanced NICU, follow specific follow-up schedules meticulously.</p>",
                "author": "Dr. Tariq Mahmood",
                "read_time": "6 mins",
                "image_url": "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "tags": ["Newborn", "Pediatrics", "NICU"]
            }
        ]
        await db.blogs.insert_many(seed_blogs)
        logger.info("Initial educational blogs seeded successfully")

    # Seed Founder / Team if empty
    team_count = await db.team.count_documents({})
    if team_count == 0:
        await db.team.insert_many([
            {
                "name": "Dr. Founder Name",
                "role": "Founder & Chief Medical Director",
                "photo_url": "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "bio": "Establishing Fatima Multispeciality Hospital in 2002 with a vision of compassionate, accessible and advanced healthcare for the families of South Delhi. (Edit this from the Staff Portal.)",
                "youtube_url": "",
                "is_founder": True,
                "order": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ])
        logger.info("Founder placeholder seeded")


# Include the API router
app.include_router(api_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:3000",
        "https://fatima-health-1.preview.emergentagent.com",
        "https://fatimahospitals.com",
        "http://fatimahospitals.com",
        "https://www.fatimahospitals.com",
        "http://187.127.186.237"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
