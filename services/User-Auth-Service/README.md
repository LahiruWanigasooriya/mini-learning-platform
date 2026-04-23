# User Auth Service API Documentation

Base URL: `http://localhost:8081`

This document provides a comprehensive guide to all REST endpoints available in the User Authentication Service.

---

## 🔐 1. Authentication Endpoints (Public)

These endpoints do not require any authentication headers.

### 1.1. Register a New User
* **URL:** `/api/auth/register`
* **Method:** `POST`
* **Description:** Creates a new user account. The default role is `STUDENT` if not specified. Allowed roles: `STUDENT`, `INSTRUCTOR`.

**Request Body (JSON):**
```json
{
    "email": "student@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
}
```

### 1.2. Login
* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Description:** Authenticates a user and returns an access token and a refresh token.

**Request Body (JSON):**
```json
{
    "email": "student@example.com",
    "password": "Password123!"
}
```

**Success Response Example:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
        "refreshToken": "uuid-refresh-token-string",
        "tokenType": "Bearer",
        "expiresIn": 900,
        "user": {
            "id": 1,
            "email": "student@example.com",
            "roles": ["STUDENT"]
        }
    }
}
```
*(Copy the `accessToken` to use in the Authorization header for protected endpoints).*

### 1.3. Refresh Token
* **URL:** `/api/auth/refresh`
* **Method:** `POST`
* **Description:** Generates a new access token using a valid refresh token.

**Request Body (JSON):**
```json
{
    "refreshToken": "uuid-refresh-token-string"
}
```

### 1.4. Logout
* **URL:** `/api/auth/logout`
* **Method:** `POST`
* **Description:** Revokes all refresh tokens for the user associated with the provided refresh token.

**Request Body (JSON):**
```json
{
    "refreshToken": "uuid-refresh-token-string"
}
```

---

## 👤 2. User Profile Endpoints (Protected)

These endpoints require a valid Access Token in the Authorization header.
**Header Format:** `Authorization: Bearer <your_access_token>`

### 2.1. Get Current Logged-In User
* **URL:** `/api/users/me`
* **Method:** `GET`
* **Description:** Retrieves the profile information of the currently authenticated user.

### 2.2. Update User Profile
* **URL:** `/api/users/me`
* **Method:** `PUT`
* **Description:** Updates the profile fields for the authenticated user. All fields are optional.

**Request Body (JSON):**
```json
{
    "firstName": "Jane",
    "lastName": "Doe",
    "bio": "I am a computer science student.",
    "phoneNumber": "+1234567890",
    "avatarUrl": "https://example.com/avatar.jpg"
}
```

---

## 🛡️ 3. Admin Endpoints (Protected - ADMIN only)

These endpoints require an Access Token for a user who has the `ADMIN` role.
**Header Format:** `Authorization: Bearer <admin_access_token>`

### 3.1. Get All Users
* **URL:** `/api/admin/users`
* **Method:** `GET`
* **Description:** Retrieves a list of all users registered on the platform.

### 3.2. Get User By ID
* **URL:** `/api/admin/users/{id}`
* **Method:** `GET`
* **Description:** Retrieves detailed information for a specific user by their ID.

### 3.3. Assign Role to User
* **URL:** `/api/admin/users/{id}/roles`
* **Method:** `PUT`
* **Description:** Assigns a new role to an existing user (e.g., upgrading a STUDENT to an INSTRUCTOR).

**Request Body (JSON):**
```json
{
    "role": "INSTRUCTOR"
}
```

### 3.4. Deactivate User
* **URL:** `/api/admin/users/{id}`
* **Method:** `DELETE`
* **Description:** Soft-deletes (deactivates) a user account. The user will no longer be able to log in.

---

## 💡 How to Test with Postman

1. **Start the application:** Ensure the Spring Boot app is running on port `8081`.
2. **Register/Login:** Send a `POST` request to `/api/auth/register` or `/api/auth/login`.
3. **Copy the Token:** Copy the `accessToken` value from the response `data` object.
4. **Set Authorization Header:** For protected routes (like `/api/users/me`), go to the **Authorization** tab in Postman, select **Bearer Token** from the dropdown, and paste your token into the field.
5. **Set Content-Type:** Ensure the **Headers** tab has `Content-Type: application/json` whenever you are sending a JSON body.
