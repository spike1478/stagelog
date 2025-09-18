# 🎭 StageLog v2.6.0 - Major Feature Release: Device Sync & Enhanced UI

**Release Date**: September 18, 2025  
**Version**: 2.6.0  
**Type**: Major Feature Release

---

## 🚀 What's New in v2.6.0

This is a **major feature release** that transforms StageLog from a single-device app into a powerful multi-device synchronized theatre tracking system!

### 🔥 **NEW: Multi-Device Sync System**
- **Real-time synchronization** across multiple devices using Firebase Realtime Database
- **Room-based sync** with unique codes for connecting your devices
- **Anonymous authentication** - no login required, complete privacy
- **EU data storage** (Belgium) for full GDPR compliance
- **Automatic cleanup** - sync data is deleted when you disconnect
- **Device management** - see connected devices and disconnect them individually

### 🎭 **NEW: Musical vs Non-Musical Rating System**
- **Smart adaptive rating** that changes based on show type
- **Musical shows**: Include Music/Songs rating with full weighting
- **Non-musical shows**: Exclude Music/Songs, rebalanced weighting for fair comparison
- **Pro Shot handling**: Excludes venue-specific ratings (Theatre Experience, Programme, Atmosphere)
- **Weighted scoring**: Different weight distributions for accurate comparisons

### ⚙️ **NEW: Dedicated Settings Page**
- **Organized settings** moved from Access Schemes page to dedicated Settings page
- **Real-time sync status** showing connected devices and room codes
- **Action feedback** with success/error indicators for all operations
- **Device management** with device type detection and disconnect options
- **Better organization** of all app settings and controls

### 🎨 **UI/UX Improvements**
- **Complete dark/light mode theming** for all new sync features
- **Better room code input** - larger, more prominent input fields
- **Fixed room code display** - now properly visible in the UI
- **Improved button sizing** and spacing throughout the app
- **Enhanced sync modal** with better multi-device support
- **Action feedback** for all settings operations

---

## 🔒 Privacy & Security

### **Privacy-First Approach**
- **Anonymous authentication** - no personal data required
- **Local-first storage** - all data stays on your device by default
- **Optional sync** - Firebase only used when you choose to sync
- **Room isolation** - each sync room is completely separate
- **EU data storage** - all Firebase data stored in Belgium (europe-west1)

### **What's NOT Stored**
- ❌ Personal information (names, emails, addresses)
- ❌ Login credentials or passwords
- ❌ Browsing history or tracking data
- ❌ Analytics or usage statistics
- ❌ Any data outside of your sync sessions

### **Data Control**
- **Complete control** over your data with easy export/import
- **Automatic cleanup** of sync data when disconnecting
- **Your own Firebase** - instructions provided for maximum privacy
- **GDPR compliant** with EU data storage and processing

---

## 🛠️ Technical Improvements

### **Firebase Integration**
- **Realtime Database** for instant synchronization
- **Anonymous authentication** for privacy
- **Room-based architecture** for data isolation
- **Error handling** and connection management
- **Device type detection** and management

### **Enhanced Rating System**
- **Adaptive weighting** based on show type
- **Musical/Non-musical detection** with UI changes
- **Pro Shot handling** with venue-specific exclusions
- **Fair comparison** across different show types

### **Better User Experience**
- **Real-time feedback** for all operations
- **Improved error handling** with user-friendly messages
- **Better device management** with type detection
- **Enhanced theming** for all new features

---

## 📦 Files Added/Modified

### **New Files**
- `firebase-sync.js` - Complete Firebase sync system
- `test-data.json` - Comprehensive test data for development

### **Updated Files**
- `index.html` - New sync modal, settings page, musical toggle
- `styles.css` - Complete theming for sync features, better sizing
- `app-fixed.js` - Sync functions, settings management, device handling
- `database.js` - Musical/non-musical rating system
- `README.md` - Complete documentation with Firebase setup
- `AI-DECLARATION.md` - Updated with new features
- `docs/GDPR.md` - EU compliance and Firebase privacy details
- `package.json` - Version bump and file listing

---

## 🚀 Getting Started

### **For New Users**
1. Download or clone the repository
2. Open `index.html` in your browser
3. Start tracking your theatre shows!

### **For Existing Users**
1. Update to v2.6.0
2. Your existing data will be preserved
3. New features are available immediately
4. Optional: Set up device sync for multi-device access

### **Device Sync Setup**
- **Option 1**: Use the default Firebase (works out of the box)
- **Option 2**: Set up your own Firebase project for maximum privacy
- See the README for complete setup instructions

---

## 🔧 Installation & Setup

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/spike1478/stagelog.git
cd stagelog

# Serve locally (optional)
npx serve .
# or
python -m http.server 8000
```

### **Firebase Setup (Optional)**
- See the comprehensive Firebase setup guide in the README
- Choose between default Firebase or your own project
- EU data storage recommended for GDPR compliance

---

## 🐛 Bug Fixes

- **Fixed rating update bug** - can now edit ratings after initial setting
- **Fixed room code display** - now properly visible in sync modal
- **Fixed input field sizing** - room code inputs now properly sized
- **Fixed dark mode theming** - complete theming for all sync features
- **Fixed device disconnect** - proper disconnect functionality with clear labels

---

## 📚 Documentation

### **Updated Documentation**
- **README.md** - Complete feature documentation and setup guides
- **AI-DECLARATION.md** - Updated with new features and transparency
- **docs/GDPR.md** - EU compliance and privacy details
- **Firebase Setup Guide** - Step-by-step instructions for privacy-focused setup

### **New Guides**
- **Device Sync Setup** - Complete guide for Firebase configuration
- **Privacy & Security** - Comprehensive privacy information
- **Musical vs Non-Musical** - Rating system explanation

---

## 🎯 What's Next

### **Planned Features**
- **Android App** - Web wrapper for mobile access
- **Enhanced Analytics** - More detailed reporting options
- **Social Features** - Share performances with friends (maybe)

### **Community**
- **GitHub Issues** - Report bugs or request features
- **GitHub Discussions** - Chat about theatre or the app
- **Contributions** - Pull requests welcome!

---

## 🙏 Acknowledgments

- **Font Awesome** for the beautiful icons
- **Firebase** for reliable real-time synchronization
- **The theatre community** for inspiration
- **AI Assistants** (Claude & ChatGPT) for development assistance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for theatre lovers everywhere**

*Track your theatre journey, one performance at a time.*
