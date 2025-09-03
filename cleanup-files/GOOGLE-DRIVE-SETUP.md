# 🌩️ Google Drive API Setup for StageLog

Enable direct Google Drive backup and restore for your StageLog data!

## 🚀 Quick Setup Steps

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Name it **"StageLog"** → **Create**

### 2. Enable Google Drive API
1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Drive API"**
3. Click **"Enable"**

### 3. Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. **Copy the API Key** (save it somewhere safe)

### 4. Create OAuth 2.0 Client ID
1. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
2. If prompted, configure OAuth consent screen:
   - Choose **"External"** user type
   - Fill in app name: **"StageLog"**
   - Add your email as developer contact
3. Choose **"Web application"** as application type
4. Add authorized JavaScript origins:
   - `http://localhost`
   - `file://`
   - (Add any other domains you'll use)
5. **Copy the Client ID**

### 5. Add Credentials to StageLog
1. Open `google-drive-api.js` in your StageLog folder
2. Find the `DRIVE_CONFIG` section at the top
3. Replace the empty strings with your credentials:

```javascript
const DRIVE_CONFIG = {
    apiKey: 'YOUR_API_KEY_HERE',           // Paste your API Key
    clientId: 'YOUR_CLIENT_ID_HERE',       // Paste your Client ID
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scopes: 'https://www.googleapis.com/auth/drive.file'
};
```

### 6. Test the Integration
1. Open StageLog in your browser
2. Go to **"Access Schemes"** page
3. Click **"Export to Drive"** - it should prompt you to sign in
4. After signing in, your backup will upload directly to Google Drive!

## ✨ Features You Get

- **🔄 Direct Upload**: No downloads, straight to Drive
- **🔐 Secure**: Uses Google's OAuth for authentication
- **📱 Cross-Device**: Access your backups from anywhere
- **🕒 Automatic Timestamps**: Each backup has a unique timestamp
- **📥 Easy Restore**: Browse and restore from any backup
- **🛡️ Safe Storage**: Your data stays in your Google account

## 🔧 Troubleshooting

**"API credentials not configured"**
- Make sure you've added both API Key and Client ID to `google-drive-api.js`

**"Sign-in failed"**
- Check that your OAuth 2.0 Client ID is correctly configured
- Make sure you've added the correct authorized JavaScript origins

**"Upload failed"**
- Check browser console for specific error messages
- Verify Google Drive API is enabled in Google Cloud Console

**Still having issues?**
- The app will automatically fall back to download method
- You can manually save downloaded files to Google Drive as a backup

## 🎯 Next Steps

Once set up, you can:
- **Schedule regular backups** (manual for now, could be automated)
- **Share backups** with other devices by saving to shared Drive folders
- **Version control** your theatre data with dated backups
- **Restore from any backup** if you need to recover data

## 🔒 Privacy & Security

- Your data stays in YOUR Google Drive account
- StageLog only accesses files it creates
- No data is sent to any other servers
- You can revoke access anytime in your Google account settings

---

**Need help?** Check the browser console (F12) for detailed error messages, or contact support.

