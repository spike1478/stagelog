# 🎭 StageLog - Theatre Performance Tracker

A web app for tracking theatre shows because why not? Built with vanilla HTML, CSS, and JavaScript - no fancy frameworks, just good old-fashioned fun! 

> **TL;DR**: Made this for me and my partner to track our theatre shows because I thought it would be fun. Threw it on GitHub in case anyone else wants to mess around with it. Use it, break it, improve it, or completely ignore it - whatever floats your boat! 🎭✨

**Current Version:** v2.8.0 - Google Maps Integration & Calendar Export

> **Latest Update:** Added Google Maps Places autocomplete for locations, Google Calendar integration (individual & bulk export), required time field, enhanced show search with Wikidata/Ovrtur, and location backfill tools!



## ✨ What It Does (Because Apparently We Need Features)

### 🎪 Performance Tracking
- **Add Shows**: Smart show search with Wikidata and Ovrtur.com integration - no more limited database!
- **Rate Everything**: Multi-dimensional rating system with weighted scoring
- **Musical vs Non-Musical**: Smart rating system that adapts based on show type
- **Track Spending**: Because theatre is expensive and we need to know just how broke we are
- **Location Tracking**: Google Maps Places autocomplete for accurate theatre locations
- **Time Management**: Required time field with automatic matinee/evening classification
- **Calendar Integration**: Add performances to Google Calendar individually or export all at once
- **Pro Shot Magic**: Special handling for when you watch recordings instead of going out
- **Edit Ratings**: Update your ratings anytime - no more being stuck with first impressions!

### 📊 Analytics (Because Data is Fun)
- **Enhanced Analytics**: Completely redesigned analytics system with modern UI
- **Pro Shot Separation**: Pro Shots tracked separately from live performances
- **Accurate Spending Stats**: Live theatre costs calculated independently (no Pro Shot contamination)
- **Stats Galore**: How many shows? How much money? How many regrets?
- **Spending Reality Check**: Detailed breakdowns of how much you've spent on culture
- **Venue & Show Stats**: Which theatre do you visit most? (Probably the cheap one)
- **Year-over-Year**: Watch your theatre addiction grow over time
- **Enhanced Achievements**: Expanded achievement system with Pro Shot-specific milestones
- **Legacy Analytics**: Old analytics system still available (but deprecated)

### 🎨 User Experience (Because We're Not Monsters)
- **Dark/Light Mode**: Because staring at bright screens at 2am is painful
- **Responsive Design**: Works on your phone, tablet, laptop, or whatever device you're using
- **Location Autocomplete**: Google Maps integration for easy theatre and city selection
- **Calendar Export**: Export all performances to Google Calendar with one click (ICS format)
- **Accessibility**: Because everyone should be able to track their theatre addiction
- **Data Export**: Export your data so you don't lose your theatre history

### 🔄 Device Sync (Because Sharing Is Caring)
- **Multi-Device Sync**: Sync your data across multiple devices in real-time
- **Room-Based System**: Create sync rooms with unique codes to connect devices
- **Real-Time Updates**: Changes appear instantly on all connected devices
- **Firebase Powered**: Secure, reliable cloud synchronization
- **No Login Required**: Anonymous authentication for easy setup
- **Privacy-First**: Use your own Firebase project for complete data control

### ♿ Accessibility Features (Because Theatre Should Be For Everyone)
- **Access Schemes**: Track what accommodations work (or don't work) for you
- **Universal Access**: Full keyboard navigation and screen reader compatibility
- **High Contrast**: Because some of us have terrible eyesight
- **Skip Links**: Quick navigation for assistive technologies

## 🚀 How to Use This Thing

### Option 1: Just Download It
1. Download or clone this repository
2. Open `index.html` in your browser
3. Start tracking shows (or don't, whatever)

### Option 2: Local Server (If You're Fancy)
```bash
# Clone the repository
git clone https://github.com/spike1478/stagelog.git
cd stagelog

# Serve with Python (if you have it)
python -m http.server 8000

# Or with Node.js (if you're that kind of person)
npx serve .

# Or with PHP (if installed)
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🗺️ Google Maps Setup (Optional - For Location Autocomplete)

StageLog can use Google Maps Places API for automatic location autocomplete. This is optional but highly recommended for accurate location data.

### Getting a Google Maps API Key

1. **Go to Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Create or Select a Project**: Create a new project or select an existing one
3. **Enable APIs**: Enable the following APIs in "APIs & Services" → "Library":
   - **Places API (New)** - Required for location autocomplete
   - **Maps JavaScript API** - Required for Maps functionality
4. **Create API Key**: Go to "APIs & Services" → "Credentials" → "Create Credentials" → "API Key"
5. **Restrict Your API Key** (Recommended):
   - Click on your API key to edit it
   - Under "Application restrictions", add your domains:
     - `http://localhost/*` (for local development)
     - `http://127.0.0.1/*` (for local development)
     - `https://yourdomain.com/*` (for production)
   - Under "API restrictions", select "Restrict key" and choose:
     - Places API (New)
     - Maps JavaScript API
   - Save your changes

### Adding the API Key to StageLog

1. Open `app-fixed.js` in your StageLog folder
2. Find the `loadGoogleMapsScript` function (around line 3485)
3. Replace `'REPLACE_WITH_YOUR_MAPS_API_KEY'` with your actual API key:
   ```javascript
   const key = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

### For the Backfill Tool

If you want to use the location backfill tool (`tools/backfill-places.html`), also update:
- `tools/backfill-places.html` - Replace `REPLACE_WITH_YOUR_MAPS_API_KEY` in all locations

**⚠️ Security Note**: Never commit API keys to version control. For production deployments, use environment variables or secure configuration management.

## 🔥 Firebase Setup (Optional - For Device Sync)

StageLog includes a device sync feature powered by Firebase. By default, it uses a shared Firebase project, but for maximum privacy and control, you can set up your own Firebase project.

### Option 1: Use Default Firebase (Easiest)
The app works out of the box with the included Firebase configuration. Your data is stored securely in the EU (Belgium) and automatically deleted when you disconnect from sync rooms.

### Option 2: Set Up Your Own Firebase Project (Maximum Privacy)

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Choose a project name (e.g., "my-stagelog-sync")
   - Enable Google Analytics (optional)

2. **Set Up Realtime Database**:
   - In your Firebase project, go to "Realtime Database"
   - Click "Create Database"
   - **Important**: Choose "europe-west1 (Belgium)" for EU data storage
   - Start in "test mode" (we'll secure it later)

3. **Get Your Configuration**:
   - Go to Project Settings (gear icon) → General tab
   - Scroll down to "Your apps" and click "Add app" → Web app
   - Register your app with a nickname
   - Copy the Firebase configuration object

4. **Update StageLog Configuration**:
   - Open `firebase-sync.js` in your StageLog folder
   - Replace the `firebaseConfig` object with your own configuration:
   ```javascript
   this.firebaseConfig = {
       apiKey: "your-api-key-here",
       authDomain: "your-project.firebaseapp.com",
       databaseURL: "https://your-project-default-rtdb.europe-west1.firebasedatabase.app",
       projectId: "your-project-id",
       storageBucket: "your-project.firebasestorage.app",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
   };
   ```

   **⚠️ Security Note**: Never commit API keys to version control. For production deployments, use environment variables or secure configuration management.

5. **Secure Your Database** (Important!):
   - In Firebase Console → Realtime Database → Rules
   - Replace the default rules with:
   ```json
   {
     "rules": {
       "rooms": {
         "$roomId": {
           ".read": "auth != null",
           ".write": "auth != null"
         }
       }
     }
   }
   ```

6. **Enable Anonymous Authentication**:
   - In Firebase Console → Authentication → Sign-in method
   - Enable "Anonymous" authentication
   - Save the changes

### Privacy Benefits of Your Own Firebase Project:
- **Complete Data Control**: Your data goes to your Firebase project only
- **EU Data Storage**: Choose europe-west1 (Belgium) for GDPR compliance
- **Custom Security Rules**: Set your own access controls
- **No Shared Resources**: No dependency on the default Firebase project
- **Full Transparency**: You can see exactly what data is stored and when

## 🔐 Secure Deployment Practices

### API Key Security
- **Never commit API keys** to version control or public repositories
- **Use environment variables** for production deployments
- **Restrict API keys** with domain and service restrictions in Google Cloud Console
- **Rotate API keys** regularly and revoke compromised keys immediately

### Production Deployment Checklist
1. **Create restricted API keys** with domain limitations
2. **Use secure configuration management** (environment variables, secrets)
3. **Test locally first** before deploying to production
4. **Monitor API key usage** for unauthorized access
5. **Keep Firebase security rules updated** and restrictive

### For Different Hosting Platforms:
- **Netlify**: Use environment variables in site settings
- **Vercel**: Use environment variables in project settings  
- **GitHub Pages**: Use GitHub Actions with secrets for deployment
- **Self-hosted**: Use server environment variables or configuration files

## 🔒 Security & Privacy

### What Data is Stored:
- **Local Storage**: All your performance data is stored locally in your browser
- **Firebase Sync**: Only temporary sync data (room codes, device IDs, performance data) during active sync sessions
- **No Personal Information**: No names, emails, or personal details are ever stored
- **Anonymous Authentication**: Firebase uses anonymous user IDs that cannot be traced back to you

### Data Access Control:
- **Local Data**: Only you can access data stored in your browser
- **Sync Data**: Only devices with the correct room code can access sync data
- **Automatic Cleanup**: Sync data is automatically deleted when you disconnect
- **No Cross-Room Access**: Each sync room is completely isolated

### Security Features:
- **Anonymous Authentication**: No login required, no personal data collected
- **Room-Based Isolation**: Each sync room is completely separate
- **Temporary Storage**: Sync data is only stored during active sessions
- **EU Data Storage**: All Firebase data stored in Belgium (europe-west1)
- **No Server-Side Storage**: No data stored on StageLog servers (there aren't any!)

### What's NOT Stored:
- ❌ Personal information (names, emails, addresses)
- ❌ Login credentials or passwords
- ❌ Browsing history or tracking data
- ❌ Analytics or usage statistics
- ❌ Any data outside of your sync sessions

## 📱 Usage

### Adding a Performance
1. Click "Add Performance" in the navigation
2. **Search for a Show**: Start typing the show name - searches Wikidata and Ovrtur.com automatically
3. Fill in the performance details:
   - **Theatre Name**: Use Google Maps autocomplete for accurate location
   - **City**: Automatically filled from Google Maps selection
   - **Date & Time**: Date and time are required (except for Pro Shots)
4. Select production type and whether it's a musical
5. Rate the performance across different categories (system adapts based on show type)
6. Add expense information (optional)
7. Save your performance

### Rating System
- **Musicals**: Music/Songs, Performance/Cast, Stage/Visuals, Story/Plot, Theatre Experience, Programme, Atmosphere
- **Non-Musicals**: Performance/Cast, Stage/Visuals, Story/Plot, Theatre Experience, Programme, Atmosphere (no Music/Songs)
- **Pro Shot**: Excludes venue-specific ratings (Theatre Experience, Programme, Atmosphere)
- **Weighted Scoring**: Different weight distributions for musicals vs non-musicals for fair comparison

### Viewing Analytics
1. Click "Analytics" in the navigation
2. Explore your performance statistics
3. View spending analysis and trends
4. Check out your achievements

### Managing Data
- **Export**: Use the export buttons in Analytics to backup your data
- **Calendar Export**: Export all performances to Google Calendar (ICS format) from Settings
- **Import**: Use the Import JSON feature to restore from backup
- **Filter**: Use the search and filter options to find specific performances

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS custom properties and responsive design
- **Vanilla JavaScript**: No frameworks - pure JavaScript for maximum compatibility
- **Local Storage**: Client-side data persistence
- **Font Awesome**: Icons for enhanced UI

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
stagelog/
├── index.html              # Main application file
├── styles.css              # All styling and theming
├── app-fixed.js            # Core application logic
├── database.js             # Database functions and data management
├── api.js                  # API functions and utilities
├── firebase-sync.js        # Firebase real-time sync functionality
├── stats-system.js         # Analytics and statistics engine
├── analytics-functions.js  # Analytics page functions
├── enhanced-analytics-functions.js # Enhanced analytics system
├── csv-import.js           # CSV import functionality
├── import-performances.js  # Performance import functions
├── musical-database.js     # Musical database and show data
├── restore-functions.js    # Data restore and backup functions
├── init-code.js            # Initialization code
├── tools/                  # Admin and utility tools
│   ├── backfill-places.html  # Location backfill tool (Google Places)
│   ├── backfill-places.js    # Backfill tool logic
│   └── places-resolver.js    # Google Places API resolver
├── docker-compose.yml      # Docker container setup
├── nginx.conf              # Nginx configuration
├── favicon.svg             # Site icon
├── README.md               # This file
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
├── SECURITY.md             # Security policy and vulnerability reporting
├── FIREBASE-SETUP.md       # Firebase configuration guide
├── RELEASE-v2.7.0.md       # Release notes for current version
├── UNRAID-SETUP.md         # Unraid deployment guide
└── docs/                   # Additional documentation
    ├── AI-DECLARATION.md   # AI usage transparency
    ├── ACCESSIBILITY.md    # Accessibility compliance
    ├── GDPR.md            # Privacy compliance
    ├── PRIVACY-POLICY.md  # Privacy policy
    └── ...
```

## 🔒 Privacy & Data

StageLog is designed with privacy in mind:
- **No Server Required**: All data stays on your device
- **No Tracking**: No analytics, cookies, or external tracking
- **Local Storage Only**: Your data never leaves your browser
- **GDPR Compliant**: Full compliance with privacy regulations
- **Export/Import**: Full control over your data

## 🤝 Contributing (Or Don't, That's Cool Too)

This is just a fun personal project, so contributions are welcome but definitely not expected! If you want to mess around with it and make it better (or worse), go for it! Check out [CONTRIBUTING.md](CONTRIBUTING.md) if you want some guidelines, but honestly, do whatever you want.

### If You Really Want to Contribute
1. Fork it
2. Make some changes
3. Test it (or don't, live dangerously)
4. Submit a PR (or don't, we won't be offended)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support (If You Really Need It)

- **Issues**: Found a bug? Feel free to report it on [GitHub Issues](https://github.com/spike1478/stagelog/issues) (but seriously, no promises on fixes!)
- **Discussions**: Want to chat about theatre or this app? Join the conversation in [GitHub Discussions](https://github.com/spike1478/stagelog/discussions)
- **Documentation**: Check the [docs/](docs/) folder if you want to read more (it's optional)

## 🎯 Roadmap (If We Feel Like It)

- [x] Device sync feature (for multiple devices - completed!)
- [ ] Maybe cloud sync (probably not)
- [ ] Mobile app (if we get really bored)
- [ ] Social features (because we need more drama in our lives)
- [ ] More reporting (because data is fun)
- [ ] Integration with ticketing services (if they're nice to us)

## 🙏 Acknowledgments (Because We're Not Monsters)

- **Font Awesome** for the pretty icons
- **Wikidata** for show information (when it's not wrong)
- **The theatre community** for being awesome and inspiring this mess
- **AI Assistants** (Claude & ChatGPT) for helping us build this thing - see [AI Declaration](docs/AI-DECLARATION.md) for the full story

## 🤖 AI Transparency

This project was built with AI assistance because we're not coding gods. For full transparency about AI usage, check out our [AI Declaration](docs/AI-DECLARATION.md).

---

**Made with ❤️ for theatre lovers everywhere**

*StageLog v2.8.0 - Track your theatre journey, one performance at a time.*  
*Last updated: November 8, 2025*