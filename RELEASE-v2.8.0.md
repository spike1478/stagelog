# 🎭 StageLog v2.8.0 - Google Maps Integration & Calendar Export

**Release Date:** November 8, 2025  
**Version:** 2.8.0  
**Type:** Minor Release (New Features & Enhancements)

---

## ✨ New Features & Enhancements

### 1. **Google Maps Places Integration**
- **Automatic Location Autocomplete:** Theatre names now use Google Maps Places API for intelligent autocomplete suggestions
- **Rich Location Data:** Automatically captures place IDs, formatted addresses, and coordinates (lat/lng) for each venue
- **City Auto-fill:** City field automatically populated from Google Maps selection, reducing manual data entry
- **Pro Shot Handling:** Google Maps integration automatically disabled for Pro Shot performances (no location needed)

### 2. **Google Calendar Integration**
- **Individual Calendar Events:** One-click "Add to Google Calendar" button on each performance card
- **Bulk Calendar Export:** Export all performances with valid dates/times as ICS file for bulk import into Google Calendar
- **Smart Time Handling:** Automatically sets 3-hour time blocks for performances (start time + 3 hours end time)
- **Location Integration:** Calendar events include full venue address from Google Maps data

### 3. **Required Time Field**
- **Mandatory Time Input:** Time is now required for all performances (except Pro Shots)
- **Time Slot Classification:** Automatic matinee/evening classification based on performance time
- **Visual Badges:** Time slot badges displayed on performance cards for quick identification
- **Warning Indicators:** Performances without times show warning badges prompting users to add missing data

### 4. **Enhanced Show Search**
- **Wikidata Integration:** Comprehensive show database search using Wikidata SPARQL queries
- **Ovrtur.com Integration:** Additional search source for theatre show information
- **Improved Error Handling:** Robust validation prevents error pages from appearing in search results
- **Better Data Quality:** Filtered results ensure only valid show data is displayed

### 5. **Location Backfill Tool**
- **Admin Tool:** Standalone HTML tool (`tools/backfill-places.html`) for enriching existing performances
- **Google Places Enrichment:** Automatically adds place IDs, addresses, and coordinates to existing venue data
- **Confidence Scoring:** Match confidence scoring helps identify performances needing manual review
- **Batch Processing:** Process all performances at once with progress tracking and export functionality

---

## 🔄 Changed

### 1. **Show Search System**
- **Before:** Limited local database with static show data
- **After:** Dynamic external API searches (Wikidata, Ovrtur) for comprehensive, up-to-date show information
- **Impact:** More accurate and complete show data, better search results

### 2. **Performance Cards**
- **Enhanced Display:** Now shows time, time slot badges (Matinee/Evening), and Google Calendar buttons
- **Location Data:** Displays formatted addresses from Google Maps when available
- **Visual Improvements:** Better organization of performance information

### 3. **Add Performance Form**
- **Google Maps Autocomplete:** Theatre name field now uses Google Maps Places autocomplete
- **Mandatory Time Field:** Time input is now required (with validation)
- **Improved UX:** City auto-fills from place selection, reducing manual entry

### 4. **Location Data Storage**
- **New Fields:** `location_place_id`, `location_address`, `location_lat`, `location_lng` stored for each performance
- **Backward Compatible:** Existing performances without location data continue to work
- **Data Enrichment:** Backfill tool allows adding location data to existing performances

---

## 🐛 Fixed

### 1. **API Key Security**
- **Issue:** API keys were previously hardcoded in some files, risking accidental commits
- **Fix:** All API keys now use secure placeholders (`REPLACE_WITH_YOUR_*_API_KEY`)
- **Impact:** ✅ No risk of exposing API keys in repository

### 2. **Version Numbering**
- **Issue:** Version numbers were inconsistent across files
- **Fix:** All version references updated to v2.8.0 consistently
- **Impact:** ✅ Clear version tracking and documentation

### 3. **Error Message Display**
- **Issue:** Error messages from external APIs were appearing in search results
- **Fix:** Implemented comprehensive response validation to filter invalid API responses
- **Impact:** ✅ Only valid show data appears in search results

---

## 🔒 Security Improvements

- **API Key Placeholders:** All API keys use placeholders to prevent accidental exposure
- **Input Validation:** Enhanced validation for Google Maps API inputs
- **Secure Key Management:** Clear instructions for secure API key configuration
- **Gitignore Updates:** Added patterns to exclude sensitive files (*api-key*, *secret*, *password*)

---

## ⚡ Performance Improvements

- **Lazy Loading:** Google Maps script loads asynchronously to improve page load times
- **Conditional Loading:** Maps integration only loads when needed (disabled for Pro Shots)
- **Efficient API Calls:** Optimized Google Places API usage with proper error handling
- **Cache Busting:** Version numbers in script URLs ensure fresh code loads

---

## 🛡️ Reliability Improvements

- **Error Handling:** Robust error handling for external API calls (Wikidata, Ovrtur, Google Maps)
- **Fallback Mechanisms:** Graceful degradation when APIs are unavailable
- **Data Validation:** Comprehensive validation prevents malformed data from breaking the app
- **Response Filtering:** Invalid API responses are filtered before display

---

## 🔧 Technical Details

### Files Modified:
- `app-fixed.js` - Google Maps integration, calendar export, time field management, show search enhancements
- `api.js` - Wikidata and Ovrtur.com integration with response validation
- `database.js` - New location and time fields storage
- `styles.css` - Calendar button and time slot badge styling
- `index.html` - Time input field, calendar export button, version numbers
- `firebase-sync.js` - API key placeholder
- `package.json` - Version updated to 2.8.0
- `README.md` - New features documentation, Google Maps setup instructions
- `CHANGELOG.md` - v2.8.0 entry
- `docs/AI-DECLARATION.md` - Updated to v2.8.0
- `.gitignore` - API key exclusion patterns

### Files Added:
- `tools/backfill-places.html` - Location backfill admin tool
- `tools/backfill-places.js` - Backfill orchestration logic
- `tools/places-resolver.js` - Google Places API (New) HTTP integration

### API Integrations:
- **Google Maps Places API:** Autocomplete for theatre names and cities
- **Google Places API (New):** HTTP endpoints for location backfill tool
- **Wikidata SPARQL:** Show database search
- **Ovrtur.com:** Additional show search source

### New Data Fields:
- `time_seen` - Performance time (required)
- `time_slot` - Automatic classification (Matinee/Evening)
- `location_place_id` - Google Places place ID
- `location_address` - Formatted address from Google Maps
- `location_lat` - Latitude coordinate
- `location_lng` - Longitude coordinate

---

## 🚀 Upgrade Instructions

1. **Download the latest files** from the repository
2. **Replace existing files** with the new versions
3. **Configure Google Maps API Key:**
   - Get a Google Maps API key from Google Cloud Console
   - Enable "Places API (New)" and "Maps JavaScript API"
   - Set API key restrictions (HTTP referrers for web)
   - Replace `REPLACE_WITH_YOUR_MAPS_API_KEY` in:
     - `app-fixed.js` (line ~3485)
     - `tools/backfill-places.html` (3 locations)
4. **Clear browser cache** to ensure new JavaScript files are loaded
5. **Test functionality:**
   - Add a new performance and verify Google Maps autocomplete works
   - Test Google Calendar export (individual and bulk)
   - Verify time field is required and time slots display correctly

---

## 🧪 Testing

All features have been thoroughly tested:
- ✅ Google Maps Places autocomplete works correctly
- ✅ City auto-fills from place selection
- ✅ Google Calendar links generate correctly with dates and times
- ✅ Bulk calendar export creates valid ICS files
- ✅ Time field validation works (required, except Pro Shots)
- ✅ Time slot classification (Matinee/Evening) is accurate
- ✅ Show search returns valid results from Wikidata and Ovrtur
- ✅ Location backfill tool processes performances correctly
- ✅ Pro Shot performances correctly disable Google Maps
- ✅ All API keys use secure placeholders
- ✅ Version numbers are consistent across all files

---

## 📊 Impact Summary

| Area | Before | After |
|------|--------|-------|
| **Location Entry** | Manual typing, prone to errors | Google Maps autocomplete with validation |
| **Calendar Integration** | None | Individual events + bulk export |
| **Time Tracking** | Optional, inconsistent | Required with automatic classification |
| **Show Search** | Limited local database | Comprehensive external API searches |
| **Location Data** | Basic city/theatre name | Rich data with place IDs and coordinates |
| **API Security** | Hardcoded keys risk | Secure placeholders prevent exposure |

---

## 🎯 What's Next

This release focuses on location accuracy and calendar integration. Future releases will continue to enhance:
- Additional calendar platform support (iCal, Outlook)
- Map visualization of performance locations
- Enhanced analytics with location-based insights
- Performance optimization and accessibility improvements

---

## 📝 Changelog

### v2.8.0 (November 8, 2025)
- ✨ Added Google Maps Places integration for location autocomplete
- ✨ Added Google Calendar integration (individual & bulk export)
- ✨ Added required time field with automatic matinee/evening classification
- ✨ Added enhanced show search with Wikidata and Ovrtur.com
- ✨ Added location backfill tool for existing performances
- 🔄 Changed show search from local database to external APIs
- 🔄 Enhanced performance cards with time badges and calendar buttons
- 🔄 Improved form with Google Maps autocomplete
- 🐛 Fixed API key security (all keys now use placeholders)
- 🐛 Fixed version numbering consistency
- 🐛 Fixed error messages appearing in search results
- 🔒 Enhanced security with API key placeholders and gitignore patterns
- ⚡ Improved performance with async script loading
- 🛡️ Enhanced reliability with robust error handling

### v2.7.0 (October 1, 2025)
- ✨ Added enhanced analytics system with Pro Shot separation
- ✨ Added Pro Shot-specific achievements and analytics
- ✨ Added legacy analytics deprecation warnings
- 🐛 Fixed future performance rating requirements bug
- 🐛 Fixed spending analytics Pro Shot contamination
- 🐛 Fixed navigation loadMyShows function error
- 🐛 Fixed rating distribution display issues

---

**Thank you for using StageLog!** 🎭✨

For support or feedback, please visit our [GitHub repository](https://github.com/spike1478/stagelog).

