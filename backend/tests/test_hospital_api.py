"""Backend integration tests for Fatima Multispeciality Hospital API."""
import os
import pytest
import requests
from datetime import datetime

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://fatima-health-1.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@fatimahospital.com"
ADMIN_PASSWORD = "FatimaAdmin2026!"


@pytest.fixture(scope="session")
def public_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    assert "access_token" in s.cookies, "access_token cookie not set"
    return s


# ----- AUTH -----
class TestAuth:
    def test_login_success(self, public_client):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "access_token" in s.cookies

    def test_login_invalid_password(self, public_client):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_without_auth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_auth(self, admin_client):
        r = admin_client.get(f"{API}/auth/me")
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL


# ----- PUBLIC ENDPOINTS -----
class TestPublicEndpoints:
    def test_get_doctors(self, public_client):
        r = public_client.get(f"{API}/doctors")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "name" in data[0]
        assert "specialization" in data[0]

    def test_get_blogs(self, public_client):
        r = public_client.get(f"{API}/blogs")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "title" in data[0]
        assert "slug" in data[0]

    def test_get_blog_by_slug(self, public_client):
        r = public_client.get(f"{API}/blogs/essential-first-trimester-tips")
        assert r.status_code == 200
        assert r.json()["slug"] == "essential-first-trimester-tips"


# ----- APPOINTMENTS (public POST, admin GET/PUT/DELETE) -----
class TestAppointments:
    appointment_id = None

    def test_create_appointment_public(self, public_client):
        payload = {
            "name": "TEST_Patient",
            "phone": "+919999999999",
            "email": "TEST_patient@example.com",
            "department": "Gynaecology",
            "preferred_date": "2026-03-01",
            "message": "Test appointment"
        }
        r = public_client.post(f"{API}/appointments", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Patient"
        assert data["status"] == "Pending"
        assert data.get("id") or data.get("_id")
        TestAppointments.appointment_id = data.get("id") or data.get("_id")

    def test_list_appointments_requires_auth(self):
        r = requests.get(f"{API}/appointments")
        assert r.status_code == 401

    def test_list_appointments_admin(self, admin_client):
        r = admin_client.get(f"{API}/appointments")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_confirm_appointment(self, admin_client):
        aid = TestAppointments.appointment_id
        assert aid, "No appointment created"
        r = admin_client.put(f"{API}/appointments/{aid}", json={"status": "Confirmed"})
        assert r.status_code == 200
        assert r.json()["status"] == "Confirmed"

    def test_delete_appointment(self, admin_client):
        aid = TestAppointments.appointment_id
        r = admin_client.delete(f"{API}/appointments/{aid}")
        assert r.status_code == 200


# ----- ENQUIRIES -----
class TestEnquiries:
    enquiry_id = None

    def test_create_enquiry_public(self, public_client):
        payload = {
            "name": "TEST_Lead",
            "phone": "+919888888888",
            "email": "TEST_lead@example.com",
            "subject": "General",
            "message": "Test enquiry"
        }
        r = public_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert d["status"] == "New"
        TestEnquiries.enquiry_id = d.get("id") or d.get("_id")

    def test_list_enquiries_requires_auth(self):
        r = requests.get(f"{API}/enquiries")
        assert r.status_code == 401

    def test_list_enquiries_admin(self, admin_client):
        r = admin_client.get(f"{API}/enquiries")
        assert r.status_code == 200

    def test_resolve_enquiry(self, admin_client):
        eid = TestEnquiries.enquiry_id
        r = admin_client.put(f"{API}/enquiries/{eid}", json={"status": "Resolved"})
        assert r.status_code == 200
        assert r.json()["status"] == "Resolved"

    def test_delete_enquiry(self, admin_client):
        eid = TestEnquiries.enquiry_id
        r = admin_client.delete(f"{API}/enquiries/{eid}")
        assert r.status_code == 200


# ----- DOCTORS CRUD (admin) -----
class TestDoctorsAdmin:
    doctor_id = None

    def test_create_doctor_requires_auth(self):
        r = requests.post(f"{API}/doctors", json={
            "name": "TEST_Doc", "qualification": "MBBS", "specialization": "Test",
            "experience_years": 5, "photo_url": "https://x.com/p.jpg"
        })
        assert r.status_code == 401

    def test_create_doctor_admin(self, admin_client):
        r = admin_client.post(f"{API}/doctors", json={
            "name": "TEST_Doc", "qualification": "MBBS", "specialization": "Test",
            "experience_years": 5, "photo_url": "https://x.com/p.jpg",
            "availability": "9-5", "is_active": True
        })
        assert r.status_code == 200
        TestDoctorsAdmin.doctor_id = r.json().get("id") or r.json().get("_id")

    def test_update_doctor(self, admin_client):
        did = TestDoctorsAdmin.doctor_id
        r = admin_client.put(f"{API}/doctors/{did}", json={
            "name": "TEST_Doc_Upd", "qualification": "MBBS", "specialization": "Test",
            "experience_years": 6, "photo_url": "https://x.com/p.jpg"
        })
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_Doc_Upd"

    def test_delete_doctor(self, admin_client):
        did = TestDoctorsAdmin.doctor_id
        r = admin_client.delete(f"{API}/doctors/{did}")
        assert r.status_code == 200


# ----- BLOGS CRUD (admin) -----
class TestBlogsAdmin:
    blog_id = None

    def test_create_blog_requires_auth(self):
        r = requests.post(f"{API}/blogs", json={
            "title": "TEST", "slug": "test-slug", "category": "x",
            "summary": "s", "content": "c", "image_url": "https://x.com/i.jpg"
        })
        assert r.status_code == 401

    def test_create_blog_admin(self, admin_client):
        r = admin_client.post(f"{API}/blogs", json={
            "title": "TEST_Blog", "slug": "test-blog-slug", "category": "Pregnancy Care",
            "summary": "Test summary", "content": "<p>Test</p>",
            "image_url": "https://x.com/i.jpg", "tags": ["Test"]
        })
        assert r.status_code == 200
        TestBlogsAdmin.blog_id = r.json().get("id") or r.json().get("_id")

    def test_delete_blog(self, admin_client):
        bid = TestBlogsAdmin.blog_id
        r = admin_client.delete(f"{API}/blogs/{bid}")
        assert r.status_code == 200
