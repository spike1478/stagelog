# Changelog

All notable changes to StageLog will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2024-09-03

### Added
- **Cost Per Ticket Analysis**: New analytics section showing per-ticket costs (divided by 2) for better comparison with standard ticket prices
- **Pro Shot Expense Exemption**: Special handling for professional recordings with "Expenses Exempt" display
- **Comprehensive Achievement System**: 50+ fun and engaging achievements covering various theatre-going milestones
- **Advanced Debugging System**: Comprehensive performance monitoring, memory tracking, and error reporting
- **WCAG 2.2 AA Compliance**: Full accessibility compliance with skip links, ARIA roles, and keyboard navigation
- **Legal Documentation**: GDPR compliance, privacy policy, cookies policy, and third-party notices
- **Data Export/Import**: JSON and CSV export functionality for data portability
- **Google Drive Integration**: Optional cloud backup using Google Drive API

### Changed
- **Analytics Loading**: Improved reliability with robust stats system initialization
- **Dashboard Stats**: Fixed calculation to only count past shows for accurate monthly averages
- **Favourite City Display**: Fixed bug showing theatre names instead of actual cities
- **Show Analysis**: Now displays full show titles instead of cryptic IDs
- **Light/Dark Mode**: Enhanced contrast and readability across all themes
- **Performance Cards**: Improved layout and information display

### Fixed
- **My Shows Page**: Resolved sorting and filtering issues
- **Key Insights Loading**: Fixed issue where insights only appeared after manual refresh
- **Analytics Dashboard**: Resolved "all zeros" display issue
- **Expense Calculations**: Corrected Pro Shot handling and cost displays
- **Accessibility**: Fixed focus management and screen reader compatibility
- **Console Logging**: Reduced verbose logging for better debugging experience

### Technical Improvements
- **Code Refactoring**: Extracted duplicate code into reusable helper methods
- **Performance Optimization**: Improved data loading and calculation efficiency
- **Error Handling**: Enhanced error handling and user feedback
- **Documentation**: Added comprehensive JSDoc comments
- **Version Management**: Updated to semantic versioning

## [2.0.0] - 2024-08-31

### Added
- **Multi-dimensional Rating System**: Overall, Acting, Production, and Atmosphere ratings
- **Comprehensive Expense Tracking**: Ticket prices, booking fees, travel costs, and other expenses
- **Advanced Analytics Dashboard**: Detailed statistics and insights
- **Access Schemes Tracking**: Monitor accessibility accommodations and their effectiveness
- **Dark/Light Mode Toggle**: Theme switching with persistent preferences
- **Responsive Design**: Mobile-first design for all screen sizes
- **Data Persistence**: Local storage with export/import capabilities

### Changed
- **Complete UI Redesign**: Modern, accessible interface
- **Performance Optimization**: Faster loading and smoother interactions
- **Code Architecture**: Modular JavaScript structure

### Fixed
- **Data Validation**: Improved input validation and error handling
- **Browser Compatibility**: Enhanced support across different browsers

## [1.0.0] - 2024-08-01

### Added
- **Initial Release**: Basic theatre performance tracking
- **Simple Rating System**: Single overall rating per performance
- **Basic Data Storage**: Local storage implementation
- **Core Features**: Add, view, and manage performances

---

## Version History Summary

- **v2.5.0**: Major feature additions, accessibility compliance, and bug fixes
- **v2.0.0**: Complete redesign with advanced analytics and expense tracking
- **v1.0.0**: Initial release with basic functionality

## Future Roadmap

### Planned for v2.6.0
- [ ] Cloud sync option
- [ ] Advanced reporting features
- [ ] Social sharing capabilities
- [ ] Integration with ticketing services

### Planned for v3.0.0
- [ ] Mobile app development
- [ ] Offline-first architecture
- [ ] Advanced data visualization
- [ ] Community features

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/) format and uses [Semantic Versioning](https://semver.org/).
