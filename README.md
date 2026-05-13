# Social Media App API

REST API built with Node.js, TypeScript, Express, MongoDB, Redis, and AWS S3.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: MongoDB + Mongoose
- **Cache**: Redis (Upstash)
- **Storage**: AWS S3
- **Notifications**: Firebase FCM
- **Email**: Nodemailer
- **Validation**: Zod

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.development
```

Fill in all values in `.env.development`. See `.env.example` for descriptions.

### 3. Set up Firebase

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key" and download the JSON
3. Save it **outside** the project folder (e.g. `~/secrets/firebase-key.json`)
4. Set `FIREBASE_KEY_PATH` in your `.env` to the full path of that file

### 4. Run in development

```bash
npm run start:dev
```

### 5. Build & run in production

```bash
npm run build
npm run start:prod
```

---

## API Reference

All protected routes require the `Authorization` header:
```
Authorization: ALLOW <access_token>
```
For admin routes use:
```
Authorization: ADMIN <access_token>
```

---

### Auth — `/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signUp` | Register new account | ❌ |
| POST | `/auth/signup/gmail` | Register / login with Google | ❌ |
| POST | `/auth/signIn` | Login | ❌ |
| PATCH | `/auth/confirmEmail` | Verify email OTP | ❌ |
| POST | `/auth/resendOtp` | Resend email OTP | ❌ |
| POST | `/auth/forgetPassword` | Request password reset OTP | ❌ |
| PATCH | `/auth/resetPassword` | Reset password with OTP | ❌ |
| PATCH | `/auth/updatePassword` | Change password | ✅ |
| POST | `/auth/logOut` | Logout (single or all devices) | ✅ |

---

### User — `/user`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/user/profile` | Get own profile | ✅ |
| PATCH | `/user/update` | Update profile info | ✅ |
| PATCH | `/user/update-password` | Change password | ✅ |
| DELETE | `/user/delete` | Delete account | ✅ |
| GET | `/user/:userId/profile` | Get another user's profile | ✅ |

---

### Posts — `/posts`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/posts/createPost` | Create a post (supports image upload) | ✅ |
| GET | `/posts/getAllPosts` | Get all public posts (paginated) | ✅ |
| GET | `/posts/get/:postId` | Get single post | ✅ |
| PATCH | `/posts/likeOrDislikePost/:postId` | Like or dislike a post | ✅ |
| PATCH | `/posts/updateContentAndSettings/:postId` | Update post content & settings | ✅ |
| PATCH | `/posts/updateAttachments/:postId` | Replace post images | ✅ |
| DELETE | `/posts/delete/:postId` | Delete post | ✅ |

**Query params for `getAllPosts`:**
- `page` — page number (default: 1)
- `limit` — results per page (default: 10)
- `search` — search in post content

---

### Comments — `/comments`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/comments/create-comment/:postId` | Add a comment | ✅ |
| GET | `/comments/getAllComments/:postId` | Get all comments on a post | ✅ |
| PATCH | `/comments/update-comment/:commentId` | Update a comment | ✅ |
| DELETE | `/comments/delete-comment/:commentId` | Delete a comment | ✅ |

---

### Admin — `/admin`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/Dashboard` | Get total users, posts, comments | ✅ Admin only |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `DB_URI_ONLINE` | MongoDB connection string |
| `REDIS_URL` | Redis connection URL |
| `ACCESS_TOKEN_KEY_USER` | JWT secret for users |
| `ACCESS_TOKEN_KEY_ADMIN` | JWT secret for admins |
| `REFRESH_TOKEN_KEY_USER` | Refresh token secret for users |
| `REFRESH_TOKEN_KEY_ADMIN` | Refresh token secret for admins |
| `PREFIX_USER` | Auth header prefix for users (e.g. `ALLOW`) |
| `PREFIX_ADMIN` | Auth header prefix for admins (e.g. `ADMIN`) |
| `EMAIL` | Sender email address |
| `PASSWORD` | Email app password |
| `CLIENT_ID` | Google OAuth client ID |
| `AWS_ACCESS_KEY` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `AWS_BUCKET_NAME` | S3 bucket name |
| `AWS_REGION` | S3 bucket region |
| `FIREBASE_KEY_PATH` | Absolute path to Firebase service account JSON |
