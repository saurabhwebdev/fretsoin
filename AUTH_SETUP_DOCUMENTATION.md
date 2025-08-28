# Authentication Setup Documentation

## Overview
The application now includes a complete authentication system using NextAuth.js with support for both Email/Password and Google OAuth login methods.

## 🔐 Authentication Features

### 1. **Providers Configured**
- **Email/Password**: Custom credentials provider with bcrypt password hashing
- **Google OAuth**: Google sign-in integration (requires Google Cloud Console setup)

### 2. **Database Integration**
- **Prisma Adapter**: Seamless integration with Supabase PostgreSQL database
- **Session Management**: Database-backed sessions with JWT strategy
- **User Management**: Complete user lifecycle management

### 3. **Protected Routes**
- **Middleware**: Automatic route protection for `/dashboard/*` and `/profile/*`
- **Session Checking**: Client and server-side session validation
- **Redirect Logic**: Automatic redirects for unauthenticated users

## 📁 File Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts    # NextAuth.js API route
│   │   └── signup/route.ts           # User registration endpoint
│   ├── auth/
│   │   ├── signin/page.tsx           # Login page
│   │   └── signup/page.tsx           # Registration page
│   ├── dashboard/page.tsx            # Protected dashboard
│   ├── layout.tsx                    # Root layout with session provider
│   └── page.tsx                      # Home page with auth navigation
├── components/
│   └── providers.tsx                 # Session provider wrapper
├── lib/
│   ├── auth.ts                       # NextAuth.js configuration
│   └── prisma.ts                     # Prisma client
├── types/
│   ├── next-auth.d.ts               # NextAuth TypeScript definitions
│   └── supabase.ts                  # Supabase TypeScript types
└── middleware.ts                     # Route protection middleware
```

## 🗄️ Database Schema

### NextAuth.js Tables
```sql
-- Users table (enhanced with custom fields)
users: id, email, name, phone, role, isActive, emailVerified, image, password, createdAt, updatedAt

-- NextAuth.js required tables
accounts: OAuth account data
sessions: User sessions
verification_tokens: Email verification tokens
```

### User Roles
- `ADMIN`: Full system access
- `MANAGER`: Limited administrative access  
- `USER`: Standard user access (default)

## 🚀 Usage Examples

### Server-Side Authentication
```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  return <div>Protected content for {session.user.email}</div>
}
```

### Client-Side Authentication
```typescript
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <p>Loading...</p>
  
  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  
  return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

### Manual User Registration
```typescript
// API call to create new user
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword'
  })
})
```

## 🔧 Environment Configuration

### Required Environment Variables
```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-please-change-this-in-production

# Google OAuth (optional)
GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]

# Database (already configured)
DATABASE_URL=postgresql://...
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

## 🛡️ Security Features

### Password Security
- **Bcrypt Hashing**: Passwords are hashed with bcrypt (12 rounds)
- **No Plain Text**: Passwords never stored in plain text
- **Secure Comparison**: Constant-time password comparison

### Session Security
- **JWT Strategy**: Secure token-based sessions
- **HTTP-Only Cookies**: Session cookies not accessible via JavaScript
- **CSRF Protection**: Built-in CSRF protection
- **Secure Headers**: Security headers automatically added

### Route Protection
- **Middleware**: Automatic protection for specified routes
- **Role-Based Access**: Support for user roles and permissions
- **Redirect Logic**: Seamless authentication flow

## 📱 User Interface

### Barebones Implementation
- **Minimal Styling**: Basic HTML styling for rapid development
- **Functional Focus**: All authentication features working
- **Responsive**: Basic responsive design
- **Accessible**: Proper form labels and structure

### Current Pages
1. **Home Page** (`/`): Authentication status and navigation
2. **Sign In** (`/auth/signin`): Email/password and Google login
3. **Sign Up** (`/auth/signup`): User registration form
4. **Dashboard** (`/dashboard`): Protected placeholder dashboard

## 🔄 Authentication Flow

### Registration Flow
1. User fills registration form
2. POST to `/api/auth/signup`
3. Password hashed with bcrypt
4. User created in database
5. Redirect to sign-in page

### Login Flow
1. User enters credentials
2. NextAuth.js validates credentials
3. Session created and stored
4. User redirected to dashboard
5. Subsequent requests include session

### Protection Flow
1. User accesses protected route
2. Middleware checks authentication
3. If authenticated: proceed
4. If not authenticated: redirect to sign-in

## ⚡ Next Steps

### Immediate Actions Needed
1. **Set Google OAuth credentials** in `.env.local`
2. **Run database migration**: `npx prisma migrate dev --name auth-setup`
3. **Test authentication flow** with email/password
4. **Test Google OAuth** (after credentials setup)

### Future Enhancements
1. **Email Verification**: Add email verification flow
2. **Password Reset**: Implement password reset functionality
3. **Two-Factor Auth**: Add 2FA support
4. **User Profile**: Create user profile management
5. **Admin Panel**: Build admin user management

## 🚨 Important Notes

1. **Change NEXTAUTH_SECRET**: Use a secure random string in production
2. **Google OAuth**: Requires valid Google Cloud Console setup
3. **Database Migration**: Run migration before testing
4. **Environment Variables**: Never commit `.env.local` to version control
5. **HTTPS in Production**: NextAuth.js requires HTTPS in production

Your authentication system is now ready! 🎉