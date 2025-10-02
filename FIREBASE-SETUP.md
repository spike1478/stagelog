# 🔥 Firebase Security Setup Guide

## 🚨 CRITICAL: API Key Security

Your Firebase API key was exposed and must be secured immediately.

## Step 1: Create .env File

Create a file named `.env` in your project root with:

```bash
FIREBASE_API_KEY=your_new_api_key_here
FIREBASE_AUTH_DOMAIN=stagelog-sync.firebaseapp.com
FIREBASE_DATABASE_URL=https://stagelog-sync-default-rtdb.europe-west1.firebasedatabase.app
FIREBASE_PROJECT_ID=stagelog-sync
FIREBASE_STORAGE_BUCKET=stagelog-sync.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=431694953672
FIREBASE_APP_ID=1:431694953672:web:3d4356d04371df4ad239fd
```

## Step 2: Update .gitignore

Add this line to your `.gitignore` file:
```
.env
```

## Step 3: Update firebase-sync.js

Replace the hardcoded values with environment variables:

```javascript
this.firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
```

## Step 4: For Production Deployment

Set environment variables on your hosting platform:
- **Netlify:** Site settings → Environment variables
- **Vercel:** Project settings → Environment variables
- **GitHub Pages:** Use GitHub Secrets in Actions

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Restrict API keys** in Google Cloud Console
4. **Monitor usage** regularly
5. **Rotate keys** periodically

## 🚨 What Happened

- Your Firebase API key was hardcoded in `firebase-sync.js`
- GitHub's secret scanning detected it after 12 days
- The key has been removed from the code
- You must revoke the old key and create a new one

## ✅ Verification Steps

1. Old API key is revoked in Google Cloud Console
2. New API key is created with restrictions
3. Code uses environment variables (not hardcoded)
4. `.env` file is in `.gitignore`
5. GitHub security alert is resolved

