# StageLog v2.8.0 Release Notes

**Release Date:** November 8, 2025  
**Version:** 2.8.0

---

## 🎉 What's New

### Google Maps Integration
- **Smart Location Autocomplete:** Theatre names now use Google Maps Places API for accurate, validated location data
- **Automatic City Detection:** City field auto-fills from your Google Maps selection
- **Rich Location Data:** Captures place IDs, addresses, and coordinates for better data quality

### Google Calendar Integration
- **One-Click Calendar Events:** Add any performance to Google Calendar with a single click
- **Bulk Export:** Export all your performances as an ICS file for bulk calendar import
- **Smart Time Blocks:** Automatically sets 3-hour time slots for each performance

### Required Time Field
- **Mandatory Time Input:** Time is now required for all performances (except Pro Shots)
- **Automatic Classification:** System automatically identifies matinee vs evening performances
- **Visual Badges:** Time slot badges displayed on performance cards

### Enhanced Show Search
- **Wikidata Integration:** Search comprehensive show database via Wikidata
- **Ovrtur.com Integration:** Additional search source for theatre shows
- **Better Results:** Improved error handling ensures only valid show data appears

### Location Backfill Tool
- **Admin Tool:** Enrich existing performances with Google Places data
- **Batch Processing:** Update all performances at once with confidence scoring
- **Export Reports:** Export backfill results for review

---

## 🔄 Changes

- Show search now uses external APIs (Wikidata, Ovrtur) instead of limited local database
- Performance cards enhanced with time badges and calendar buttons
- Add performance form now includes Google Maps autocomplete
- Location data now stored with place IDs, addresses, and coordinates

---

## 🐛 Fixes

- All API keys now use secure placeholders (no risk of accidental exposure)
- Version numbering consistency across all files
- Error messages no longer appear in search results

---

## 🚀 Upgrade Path

1. Download the latest files
2. Configure your Google Maps API key (see README.md for instructions)
3. Replace `REPLACE_WITH_YOUR_MAPS_API_KEY` in:
   - `app-fixed.js`
   - `tools/backfill-places.html`
4. Clear browser cache
5. Start using the new features!

---

## 📚 Documentation

- Full release notes: [RELEASE-v2.8.0.md](RELEASE-v2.8.0.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)
- Setup guide: [README.md](README.md)

---

## ⚠️ Breaking Changes

None. This is a backward-compatible release. Existing data continues to work, and new features are additive.

---

**For detailed information, see [RELEASE-v2.8.0.md](RELEASE-v2.8.0.md)**

