# 🎭 StageLog - Theatre Performance Tracker

A comprehensive web application for tracking theatre performances, ratings, expenses, and analytics. Built with vanilla HTML, CSS, and JavaScript - no frameworks required!



## ✨ Features

### 🎪 Performance Tracking
- **Add Performances**: Track shows with detailed information including venue, date, ratings, and expenses
- **Rating System**: Multi-dimensional rating system (Overall, Acting, Production, Atmosphere)
- **Expense Tracking**: Comprehensive cost tracking including tickets, fees, travel, and other expenses
- **Pro Shot Support**: Special handling for professional recordings with expense exemptions

### 📊 Advanced Analytics
- **Performance Overview**: Quick stats including total shows, average rating, and upcoming performances
- **Spending Analysis**: Detailed cost breakdowns with per-visit and per-ticket calculations
- **Venue & Show Statistics**: Track your most visited venues and favorite shows
- **Year-over-Year Comparisons**: See how your theatre-going habits change over time
- **Achievement System**: Fun and engaging achievements to celebrate your theatre journey

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.2 AA compliant with keyboard navigation and screen reader support
- **Data Export**: Export your data as JSON or CSV for backup or analysis

### ♿ Accessibility Features
- **Access Schemes**: Track accessibility accommodations and their effectiveness
- **Universal Access**: Full keyboard navigation and screen reader compatibility
- **High Contrast**: Optimized color schemes for better visibility
- **Skip Links**: Quick navigation for assistive technologies

## 🚀 Quick Start

### Option 1: Direct Download
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start tracking your theatre performances!

### Option 2: Local Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/stagelog.git
cd stagelog

# Serve with Python (if installed)
python -m http.server 8000

# Or with Node.js (if installed)
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

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/yourusername/stagelog/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/yourusername/stagelog/discussions)
- **Documentation**: Check the [docs/](docs/) folder for detailed guides

## 🎯 Roadmap

- [ ] Cloud sync option
- [ ] Mobile app
- [ ] Social features
- [ ] Advanced reporting
- [ ] Integration with ticketing services

## 🙏 Acknowledgments

- **Font Awesome** for the beautiful icons
- **Wikidata** for show information
- **The theatre community** for inspiration and feedback
- **AI Assistants** (Claude & ChatGPT) for development assistance - see [AI Declaration](AI-DECLARATION.md) for details

## 🤖 AI Transparency

This project was developed with AI assistance. For full transparency about AI usage, please see our [AI Declaration](AI-DECLARATION.md).

---

**Made with ❤️ for theatre lovers everywhere**

*StageLog v2.5.0 - Track your theatre journey, one performance at a time.*