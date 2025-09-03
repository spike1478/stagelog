# 🎭 StageLog - Theatre Performance Tracker

A web app for tracking theatre shows because why not? Built with vanilla HTML, CSS, and JavaScript - no fancy frameworks, just good old-fashioned fun! 

> **TL;DR**: Made this for me and my partner to track our theatre shows because I thought it would be fun. Threw it on GitHub in case anyone else wants to mess around with it. Use it, break it, improve it, or completely ignore it - whatever floats your boat! 🎭✨



## ✨ What It Does (Because Apparently We Need Features)

### 🎪 Performance Tracking
- **Add Shows**: Because remembering what you saw is hard
- **Rate Everything**: Overall, Acting, Production, Atmosphere - judge away!
- **Track Spending**: Because theatre is expensive and we need to know just how broke we are
- **Pro Shot Magic**: Special handling for when you watch recordings instead of going out

### 📊 Analytics (Because Data is Fun)
- **Stats Galore**: How many shows? How much money? How many regrets?
- **Spending Reality Check**: Detailed breakdowns of how much you've spent on culture
- **Venue & Show Stats**: Which theatre do you visit most? (Probably the cheap one)
- **Year-over-Year**: Watch your theatre addiction grow over time
- **Achievements**: Silly badges for doing theatre things (because why not?)

### 🎨 User Experience (Because We're Not Monsters)
- **Dark/Light Mode**: Because staring at bright screens at 2am is painful
- **Responsive Design**: Works on your phone, tablet, laptop, or whatever device you're using
- **Accessibility**: Because everyone should be able to track their theatre addiction
- **Data Export**: Export your data so you don't lose your theatre history

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

## 📱 Usage

### Adding a Performance
1. Click "Add Performance" in the navigation
2. Fill in the show details (title, venue, date, etc.)
3. Rate the performance across different categories
4. Add expense information (optional)
5. Save your performance

### Viewing Analytics
1. Click "Analytics" in the navigation
2. Explore your performance statistics
3. View spending analysis and trends
4. Check out your achievements

### Managing Data
- **Export**: Use the export buttons in Analytics to backup your data
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
├── stats-system.js         # Analytics and statistics engine
├── analytics-functions.js  # Analytics page functions
├── debug-system.js         # Advanced debugging tools
├── init-code.js            # Initialization code
├── backup.ps1              # Backup script
├── README.md               # This file
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
└── docs/                   # Additional documentation
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

- [ ] Maybe cloud sync (probably not)
- [ ] Mobile app (if we get really bored)
- [ ] Social features (because we need more drama in our lives)
- [ ] More reporting (because data is fun)
- [ ] Integration with ticketing services (if they're nice to us)

## 🙏 Acknowledgments (Because We're Not Monsters)

- **Font Awesome** for the pretty icons
- **Wikidata** for show information (when it's not wrong)
- **The theatre community** for being awesome and inspiring this mess
- **AI Assistants** (Claude & ChatGPT) for helping us build this thing - see [AI Declaration](AI-DECLARATION.md) for the full story

## 🤖 AI Transparency

This project was built with AI assistance because we're not coding gods. For full transparency about AI usage, check out our [AI Declaration](AI-DECLARATION.md).

---

**Made with ❤️ for theatre lovers everywhere**

*StageLog v2.5.0 - Track your theatre journey, one performance at a time.*