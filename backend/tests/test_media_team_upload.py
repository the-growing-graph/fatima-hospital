"""Backend tests for new Media, Team, and Upload endpoints (iteration 2)."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@fatimahospital.com"
ADMIN_PASSWORD = "FatimaAdmin2026!"


@pytest.fixture(scope="session")
def admin_client():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


# ---------- UPLOAD ----------
class TestUpload:
    uploaded_path = None
    uploaded_url = None

    def test_upload_requires_auth(self):
        # Tiny PNG (1x1 transparent)
        png = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
            b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\x00\x01"
            b"\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        files = {"file": ("test.png", io.BytesIO(png), "image/png")}
        r = requests.post(f"{API}/upload", files=files)
        assert r.status_code == 401

    def test_upload_admin_success(self, admin_client):
        png = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
            b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\x00\x01"
            b"\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        files = {"file": ("TEST_upload.png", io.BytesIO(png), "image/png")}
        r = admin_client.post(f"{API}/upload", files=files)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and "path" in data
        assert data["url"].startswith("/api/files/")
        TestUpload.uploaded_path = data["path"]
        TestUpload.uploaded_url = data["url"]

    def test_serve_file_public(self):
        assert TestUpload.uploaded_path, "Upload didn't produce a path"
        url = f"{BASE_URL}{TestUpload.uploaded_url}"
        r = requests.get(url)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/")
        assert len(r.content) > 0

    def test_serve_file_not_found(self):
        r = requests.get(f"{API}/files/does-not-exist/missing.png")
        assert r.status_code == 404


# ---------- MEDIA ----------
class TestMedia:
    media_id = None

    def test_get_media_public(self):
        r = requests.get(f"{API}/media")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_media_requires_auth(self):
        r = requests.post(f"{API}/media", json={
            "title": "TEST_media", "media_type": "image",
            "url": "https://example.com/x.jpg", "category": "Gallery"
        })
        assert r.status_code == 401

    def test_create_media_admin(self, admin_client):
        r = admin_client.post(f"{API}/media", json={
            "title": "TEST_media", "media_type": "image",
            "url": "https://example.com/x.jpg", "category": "Gallery",
            "order": 99
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["title"] == "TEST_media"
        assert d["media_type"] == "image"
        TestMedia.media_id = d.get("id") or d.get("_id")
        assert TestMedia.media_id

    def test_media_visible_in_list(self):
        r = requests.get(f"{API}/media")
        assert r.status_code == 200
        ids = [(m.get("id") or m.get("_id")) for m in r.json()]
        assert TestMedia.media_id in ids

    def test_delete_media_requires_auth(self):
        r = requests.delete(f"{API}/media/{TestMedia.media_id}")
        assert r.status_code == 401

    def test_delete_media_admin(self, admin_client):
        r = admin_client.delete(f"{API}/media/{TestMedia.media_id}")
        assert r.status_code == 200
        # Verify removed
        r2 = requests.get(f"{API}/media")
        ids = [(m.get("id") or m.get("_id")) for m in r2.json()]
        assert TestMedia.media_id not in ids


# ---------- TEAM ----------
class TestTeam:
    member_id = None

    def test_get_team_public_has_seeded_founder(self):
        r = requests.get(f"{API}/team")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Expected at least one seeded founder"
        founders = [m for m in data if m.get("is_founder")]
        assert len(founders) > 0, "Expected at least one founder in team list"

    def test_create_team_requires_auth(self):
        r = requests.post(f"{API}/team", json={
            "name": "TEST_member", "role": "Tester"
        })
        assert r.status_code == 401

    def test_create_team_admin(self, admin_client):
        r = admin_client.post(f"{API}/team", json={
            "name": "TEST_member", "role": "Tester", "bio": "bio", "youtube_url": "",
            "photo_url": "", "is_founder": False, "order": 50
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["name"] == "TEST_member"
        TestTeam.member_id = d.get("id") or d.get("_id")
        assert TestTeam.member_id

    def test_update_team_admin(self, admin_client):
        r = admin_client.put(f"{API}/team/{TestTeam.member_id}", json={
            "name": "TEST_member_upd", "role": "Tester", "bio": "bio2"
        })
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_member_upd"

    def test_delete_team_requires_auth(self):
        r = requests.delete(f"{API}/team/{TestTeam.member_id}")
        assert r.status_code == 401

    def test_delete_team_admin(self, admin_client):
        r = admin_client.delete(f"{API}/team/{TestTeam.member_id}")
        assert r.status_code == 200
