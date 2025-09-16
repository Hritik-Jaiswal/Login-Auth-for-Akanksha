# Simple Login Authentication System

A modern Angular-based login authentication system with enhanced security features including failed attempt tracking, account lockout, and password reset functionality.
**This is a simple login authentication system with enhanced security features including failed attempt tracking, account lockout, and password reset functionality.**
## If you need something else or need me to explain if all these features are bit overwhelming then just dm me akanksha. but do check the code and try to understand it through this readme.it has all the details.

## Features

### 🔐 Enhanced Security
- **Failed Login Attempt Tracking**: Monitors and tracks failed login attempts
- **Account Lockout**: Automatically locks accounts after 3 failed attempts for 15 minutes
- **Real-time Lockout Timer**: Shows remaining lockout time to users
- **Password Validation**: Enforces minimum password requirements

### 🚀 User Experience
- **Username Verification**: Check if username exists before password entry
- **Dynamic Password Creation**: Create passwords for new users seamlessly
- **Forgot Password**: Direct password reset functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Instant validation and error messages

### 🛡️ Security Best Practices
- **Session Management**: Secure token-based authentication
- **Local Storage Protection**: Encrypted storage of sensitive data
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   ├── user/
│   │   │   └── user.component.ts
│   │   └── book/
│   │       └── book.component.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── models/
│   │   └── auth.models.ts
│   └── app.component.ts
├── main.ts
├── index.html
└── styles.css
```

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Angular CLI (optional but recommended)

### Step-by-Step Setup

1. **Navigate to Project Directory**
   Just go to the directory where you have downloaded this project akanksha.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run serve
   ```

4. **Open Application**
   - The application will automatically open in your default browser
   - If not, navigate to `http://localhost:4200`

5. **Build for Production**
   ```bash
   npm run build
   ```

### Alternative Angular CLI Commands

If you have Angular CLI installed globally:
```bash
ng serve --open    # Start dev server and open browser
ng build --prod    # Production build
ng test           # Run unit tests
```

## Usage

### Login Flow

1. **Username Check**: Enter username and click "Check" to verify existence
2. **Password Entry**: 
   - If user exists with password: Enter existing password
   - If user exists without password: Create new password
3. **Authentication**: System validates credentials and redirects based on role

### Security Features

- **Failed Attempts**: After each failed login, users see remaining attempts
- **Account Lockout**: After 3 failed attempts, account locks for 15 minutes
- **Password Reset**: Users can reset password via "Forgot Password" button
- **Role-based Routing**: Admins go to `/user`, regular users to `/book`

## API Endpoints

The application expects the following backend endpoints:

```typescript
GET    /api/auth/check-user/{username}     // Check if user exists
GET    /api/auth/password-status/{username} // Check if password is set
POST   /api/auth/set-password              // Set new password
POST   /api/auth/login                     // Login user
POST   /api/auth/forgot-password           // Request password reset
POST   /api/auth/reset-password            // Reset password with token
```

## Configuration

Update the API base URL in `auth.service.ts`:

```typescript
private readonly API_BASE_URL = 'http://localhost:8080/api'; // Change as needed
```

## Security Settings

- **Max Failed Attempts**: 3 (configurable in `auth.service.ts`)
- **Lockout Duration**: 15 minutes (configurable in `auth.service.ts`)
- **Password Min Length**: 6 characters
- **Username Min Length**: 3 characters

## Components

### LoginComponent
- Handles user authentication flow
- Manages failed attempt tracking
- Provides password reset functionality
- Responsive UI with real-time feedback

### AuthService
- Manages authentication state
- Handles API communication
- Tracks failed login attempts
- Manages session storage

### Models
- TypeScript interfaces for type safety
- Comprehensive data models for all API interactions

## Styling

The application uses a modern, responsive design with:
- Gradient backgrounds
- Smooth animations
- Accessible color schemes
- Mobile-first responsive design
- Custom loading spinners

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Features

1. Create new components in `src/app/components/`
2. Add services in `src/app/services/`
3. Define interfaces in `src/app/models/`
4. Update routing in `main.ts`

### Testing

Run tests with:
```bash
npm test
```

## Complete Setup Guide & Features

### 🚀 **Getting Started (Complete Process)**

After following the installation steps above, your Angular login authentication system will be ready with these enhanced features:

### ✅ **Key Features Implemented:**

1. **Failed Login Attempt Tracking** - Monitors and tracks failed login attempts with visual feedback
2. **Account Lockout System** - Automatically locks accounts for 15 minutes after 3 failed attempts
3. **Real-time Lockout Timer** - Shows countdown timer when account is locked
4. **Forgot Password Button** - Direct password reset functionality always available to users
5. **Username Verification** - Checks if username exists before allowing password entry
6. **Dynamic Password Creation** - Seamlessly handles password creation for new users
7. **Role-based Routing** - Admins redirect to `/user`, regular users to `/book`
8. **Modern Responsive UI** - Beautiful gradient design that works on all devices

### 🛡️ **Security Features:**

- **Progressive Warnings**: Shows remaining attempts before lockout (3 max attempts)
- **Automatic Lockout Reset**: Account unlocks automatically after timeout period
- **Session Management**: Secure token-based authentication with session storage
- **Password Validation**: Enforces minimum 6-character password requirement
- **Username Validation**: Requires minimum 3-character username
- **Comprehensive Error Handling**: User-friendly error messages for all scenarios

### 🎯 **How the Login Flow Works:**

1. **Username Check** → User enters username and clicks "Check" to verify existence
2. **Password Handling** → System determines if user needs to enter existing password or create new one
3. **Failed Attempts Tracking** → Shows remaining attempts with color-coded warnings
4. **Account Lockout** → After 3 failed attempts, shows 15-minute countdown timer
5. **Forgot Password** → Always available button for password reset functionality
6. **Successful Login** → Role-based redirection (Admin → `/user`, Regular → `/book`)

### 🎨 **UI/UX Features:**

- **Real-time Feedback**: Instant validation and error messages with icons
- **Loading Spinners**: Visual feedback during API calls
- **Responsive Design**: Mobile-first approach that works on all screen sizes
- **Smooth Animations**: Fade-in and slide-in effects for better user experience
- **Accessibility**: Proper focus management and keyboard navigation
- **Color-coded Messages**: Success (green), Error (red), Warning (yellow), Info (blue)

### 🔧 **Backend API Requirements:**

Your Angular application expects these backend endpoints (update base URL in `auth.service.ts`):

```typescript
// Base URL: http://localhost:8080/api (configurable)

GET    /api/auth/check-user/{username}        // Check if user exists
GET    /api/auth/password-status/{username}   // Check if password is set
POST   /api/auth/set-password                 // Set new password for user
POST   /api/auth/login                        // Authenticate user login
POST   /api/auth/forgot-password              // Request password reset
POST   /api/auth/reset-password               // Reset password with token
```

### ⚙️ **Customization Options:**

**Security Settings** (in `auth.service.ts`):
- `MAX_FAILED_ATTEMPTS`: Currently set to 3 attempts
- `LOCKOUT_DURATION`: Currently set to 15 minutes (900,000 ms)
- `API_BASE_URL`: Update to match your backend server

**Validation Rules** (in login component):
- Password minimum length: 6 characters
- Username minimum length: 3 characters
- Both can be customized in the form validators

**Styling Customization**:
- Update colors and themes in `login.component.css`
- Modify global styles in `src/styles.css`
- Responsive breakpoints can be adjusted in CSS media queries

### 🏗️ **File Structure Explanation:**

```
src/app/
├── models/auth.models.ts          # TypeScript interfaces for type safety
├── services/auth.service.ts       # Authentication service with security features
├── components/
│   ├── login/                     # Main login component
│   │   ├── login.component.ts     # Component logic with security features
│   │   ├── login.component.html   # Responsive UI template
│   │   └── login.component.css    # Modern styling with animations
│   ├── user/user.component.ts     # Admin dashboard (post-login)
│   └── book/book.component.ts     # Regular user dashboard (post-login)
└── app.component.ts               # Root application component
```

### 🔍 **Troubleshooting:**

**If you see TypeScript errors**: Run `npm install` to install all Angular dependencies

**If the app doesn't start**: 
- Ensure Node.js version 16+ is installed
- Try `npm run serve` instead of `npm start`
- Check that port 4200 is available

**If API calls fail**:
- Update the `API_BASE_URL` in `auth.service.ts` to match your backend
- Ensure your backend server is running and accessible
- Check browser console for CORS issues

### 📱 **Browser Compatibility:**

The application is tested and works on:
- Chrome (latest versions)
- Firefox (latest versions)  
- Safari (latest versions)
- Microsoft Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 🚀 **Production Deployment:**

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your web server
3. Configure your backend API endpoints
4. Set up HTTPS for production security
5. Configure proper CORS settings on your backend

This authentication system is production-ready with comprehensive security features, modern UI/UX, and full TypeScript implementation!

## 🧪 **Testing Guide with Mock Users**

The application includes a mock authentication service for testing all features without needing a backend API.

### **Test Users & Passwords:**

| Username | Password | Role | Status |
|----------|----------|------|--------|
| `admin` | `admin123` | Admin | Has Password ✅ |
| `akanksha` | `akanksha123` | Regular User | Has Password ✅ |
| `izel` | `izel123` | Regular User | Has Password ✅ |
| `vaidhei` | `vaidhei123` | Regular User | Has Password ✅ |
| `user` | *(no password)* | Regular User | Needs Password ⚠️ |

### **How to Test All Features:**

#### **1. Test Successful Login:**
- Username: `admin` → Password: `admin123` 
  - Should redirect to Admin Dashboard (`/user`)

- Username: `akanksha` → Password: `akanksha123`
  - Should redirect to Book Management (`/book`)

- Username: `izel` → Password: `izel123`
  - Should redirect to Book Management (`/book`)

- Username: `vaidhei` → Password: `vaidhei123`
  - Should redirect to Book Management (`/book`)

#### **2. Test Password Creation:**
- Username: `user` → Click "Check"
- System will say "No password set - please create a password now"
- Enter any password (min 6 chars) → Click "Create Password"

#### **3. Test Failed Login Attempts:**
- Username: `akanksha` → Wrong password: `wrong123`
- Try 3 times to see the lockout system in action
- Watch the countdown timer when locked

#### **4. Test Username Validation:**
- Try usernames with less than 3 characters
- Try non-existent usernames like `xyz`

#### **5. Test Forgot Password:**
- Enter any existing username → Click "Forgot Password?"
- Should show success message

#### **6. Test Form Validation:**
- Try empty fields
- Try passwords less than 6 characters
- See real-time error messages

### **Testing Steps:**

1. **Open** `http://localhost:4200` in your browser
2. **Try the admin login** first:
   - Username: `admin`
   - Click "Check" 
   - Password: `admin123`
   - Click "Login"
3. **Test with different users**:
   - Try `akanksha` with password `akanksha123`
   - Try `izel` with password `izel123`
   - Try `vaidhei` with password `vaidhei123`
4. **Test failed attempts** with wrong passwords
5. **Try the password creation** with username `user`

### **What You Should See:**
- Real authentication flow with the test users
- Failed attempt tracking that actually works
- Account lockout with countdown timer
- Password creation for users without passwords
- Role-based routing (admin vs regular user dashboards)
- Loading spinners and smooth animations

### **Switching to Real Backend:**
When ready for production, uncomment the HTTP calls in `auth.service.ts` and comment out the mock service calls.

## License

This project is licensed under the MIT License.
"# Login-Auth-for-Akanksha" 
