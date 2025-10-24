# 🔥 Firebase Configuration Guide

## 📋 Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name: `tutoria-academy-prod`
4. Enable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable sign-in methods:
   - ✅ **Email/Password**
   - ✅ **Google**
   - ✅ **Microsoft** (for school accounts)
4. Configure authorized domains

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Select **Production mode** (we'll set rules later)
4. Choose location: `us-central1` or closest to users
5. Click "Enable"

### 4. Enable Storage

1. Go to **Storage**
2. Click "Get Started"
3. Use default security rules
4. Click "Done"

### 5. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Register app name: `tutoria-academy-web`
5. **Copy the config object**

```javascript
// Your Firebase config will look like this:
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 6. Create Environment Files

Create `.env.local` in project root:

```env
# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Optional: Analytics
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **Important**: Add `.env.local` to `.gitignore`

### 7. Install Firebase

```bash
npm install firebase
```

### 8. Firestore Security Rules

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || hasRole('admin');
    }
    
    // Student profiles
    match /studentProfiles/{profileId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(profileId) || hasRole('teacher') || hasRole('admin');
    }
    
    // Cognitive gym profiles
    match /gymProfiles/{profileId} {
      allow read: if isOwner(profileId) || hasRole('teacher') || hasRole('admin');
      allow write: if isOwner(profileId);
    }
    
    // Game scores
    match /gameScores/{scoreId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.userId) || hasRole('admin');
    }
    
    // Progress tracking
    match /progress/{userId} {
      allow read: if isOwner(userId) || hasRole('teacher') || hasRole('admin');
      allow write: if isOwner(userId);
    }
    
    // Gamification data
    match /gamification/{userId} {
      allow read: if isOwner(userId) || hasRole('teacher') || hasRole('admin');
      allow write: if isOwner(userId);
    }
    
    // Screening data (teachers/admin only)
    match /screening/{screeningId} {
      allow read: if hasRole('teacher') || hasRole('director') || hasRole('admin');
      allow write: if hasRole('teacher') || hasRole('director') || hasRole('admin');
    }
    
    // Content (teacher resources)
    match /content/{contentId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('teacher') || hasRole('admin');
    }
    
    // Schools (multi-tenancy)
    match /schools/{schoolId} {
      allow read: if isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.schoolId == schoolId;
      allow write: if hasRole('director') || hasRole('admin');
    }
  }
}
```

### 9. Storage Security Rules

Go to **Storage** → **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // User avatars
    match /avatars/{userId}/{fileName} {
      allow read: if true; // Public read
      allow write: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // Student submissions
    match /submissions/{userId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
      allow delete: if isOwner(userId);
    }
    
    // Teacher content
    match /content/{teacherId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isOwner(teacherId);
      allow delete: if isOwner(teacherId);
    }
    
    // School resources (shared within school)
    match /schools/{schoolId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated(); // Can be restricted further
    }
  }
}
```

---

## 📊 Firestore Collections Structure

### users
```typescript
{
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'director' | 'admin';
  schoolId: string;
  gradeLevel?: 'primaria' | 'secundaria' | 'preparatoria';
  createdAt: timestamp;
  lastLogin: timestamp;
}
```

### studentProfiles
```typescript
{
  userId: string;
  schoolId: string;
  personalInfo: {
    dateOfBirth: string;
    grade: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  subscriptionStatus: 'active' | 'trial' | 'expired';
}
```

### gymProfiles
```typescript
{
  userId: string;
  stats: {
    level: number;
    xp: number;
    totalXP: number;
    coins: number;
  };
  areas: {
    [areaId: string]: {
      level: number;
      xp: number;
      completedActivities: string[];
    }
  };
  achievements: string[];
  streak: {
    current: number;
    longest: number;
    lastActivity: timestamp;
  };
}
```

### gameScores
```typescript
{
  gameId: string;
  userId: string;
  schoolId: string;
  score: number;
  metrics: object;
  timestamp: timestamp;
  gradeLevel: string;
}
```

### progress
```typescript
{
  userId: string;
  subjects: {
    [subjectId: string]: {
      completed: number;
      total: number;
      mastery: number;
    }
  };
  lastUpdated: timestamp;
}
```

---

## 🔐 Authentication Setup

### Enable Auth Providers

#### Google Sign-In
1. In Authentication → Sign-in method
2. Enable Google
3. Add support email
4. Save

#### Microsoft Sign-In (for schools)
1. Enable Microsoft provider
2. Get Microsoft OAuth credentials from Azure Portal
3. Add Client ID and Secret
4. Configure redirect URI

---

## 🚀 Next Steps After Setup

1. ✅ Install Firebase SDK
2. ✅ Create firebase config file
3. ✅ Implement auth service
4. ✅ Implement Firestore service
5. ✅ Test authentication flow
6. ✅ Migrate localStorage data to Firestore
7. ✅ Add offline persistence
8. ✅ Implement real-time listeners

---

## 📝 Important Notes

### Security
- ✅ Never commit `.env.local` to git
- ✅ Use security rules to protect data
- ✅ Enable App Check for production
- ✅ Set up rate limiting

### Performance
- ✅ Enable offline persistence
- ✅ Use query limits
- ✅ Index frequently queried fields
- ✅ Use subcollections for nested data

### Cost Optimization
- ✅ Use Cloud Functions for heavy operations
- ✅ Batch writes when possible
- ✅ Cache read-heavy data
- ✅ Monitor usage in Firebase Console

---

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Security Rules Reference](https://firebase.google.com/docs/rules)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

**Ready to implement! Start with creating the Firebase config file.** 🔥
