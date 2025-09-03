# 📥 StageLog Data Import Guide

Multiple ways to import your theatre data into StageLog!

## 🚀 **Quick Import Methods**

### **1. 📁 JSON File Import (New!)**
**Best for:** Restoring from StageLog backups

✅ **How to use:**
1. Go to **"Access Schemes"** page
2. Click **"Import JSON"** button  
3. Select your StageLog backup file (`.json`)
4. Review the import preview
5. Confirm to merge with existing data

✅ **Features:**
- **Smart merging** - no duplicates created
- **Preview before import** - see what will be imported
- **Automatic validation** - ensures file format is correct
- **Safe import** - existing data is preserved

---

### **2. 🌩️ Google Drive Restore**
**Best for:** Syncing across devices

✅ **How to use:**
1. Set up Google Drive API (see `GOOGLE-DRIVE-SETUP.md`)
2. Click **"Restore from Drive"** 
3. Browse your cloud backups
4. Select backup to restore

---

### **3. 📊 CSV Import** 
**Best for:** Importing from spreadsheets

✅ **Files available:**
- `csv-import.js` - Built-in CSV parsing
- Supports standard theatre data formats

✅ **To use CSV import:**
1. Prepare CSV with columns: `show_title`, `date_seen`, `theatre_name`, `city`, etc.
2. Use the CSV import functionality (may need UI enhancement)

---

### **4. 🔧 Direct JavaScript Import**
**Best for:** Bulk data migration

✅ **Using import-performances.js:**
1. Edit `import-performances.js` file
2. Add your performance data to the array
3. Run the import function from browser console
4. Data gets added to localStorage

---

## 📋 **Import File Formats**

### **StageLog JSON Format:**
```json
{
  "exportDate": "2025-08-30T12:00:00.000Z",
  "exportType": "StageLog Drive Backup", 
  "version": "2.0.0",
  "stagelog_shows": [
    {
      "id": "unique_id",
      "title": "Show Name",
      "synopsis": "Description",
      "composer": "Composer Name",
      "lyricist": "Lyricist Name"
    }
  ],
  "stagelog_performances": [
    {
      "id": "unique_id",
      "show_id": "linked_show_id",
      "date_seen": "2025-08-30",
      "theatre_name": "Theatre Name",
      "city": "City",
      "production_type": "West End",
      "rating": {
        "music_songs": 4.5,
        "story_plot": 4.0,
        "performance_cast": 5.0,
        "stage_visuals": 4.5,
        "rewatch_value": 3.5
      },
      "ticket_price": 85.00,
      "currency": "GBP",
      "notes_on_access": "Access notes",
      "general_notes": "General notes"
    }
  ],
  "stagelog_access_schemes": [...],
  "user_preferences": {
    "theme": "dark"
  }
}
```

---

## 🔄 **Migration Scenarios**

### **From Old StageLog Version:**
1. **Export** from old version using export feature
2. **Import JSON** into new version
3. **Verify** data transferred correctly

### **From Other Apps:**
1. **Export** data to CSV/JSON from other app
2. **Convert** to StageLog format (if needed)
3. **Import JSON** into StageLog

### **From Spreadsheet:**
1. **Export** spreadsheet as CSV
2. **Convert** to JSON format (or use CSV import)
3. **Import** into StageLog

### **Cross-Device Sync:**
1. **Export to Drive** from Device A
2. **Restore from Drive** on Device B
3. **Automatic sync** maintained

---

## ⚠️ **Important Notes**

### **Data Merging:**
- Import **adds to** existing data (doesn't replace)
- **Duplicates are automatically skipped** (based on ID)
- **Existing data is never deleted** during import

### **Backup First:**
- **Always export** your current data before importing
- **Test imports** with small datasets first
- **Keep backup files** in multiple locations

### **File Validation:**
- Import validates JSON structure
- **Error messages** help identify issues
- **Preview shows** what will be imported

---

## 🛠️ **Troubleshooting**

### **"Invalid JSON file" Error:**
- Check file format matches StageLog structure
- Ensure JSON is valid (use JSON validator)
- Try opening file in text editor to check content

### **"No new data imported":**
- All items already exist (duplicates skipped)
- Check if IDs match existing data
- Try clearing localStorage and reimporting

### **Import Button Not Working:**
- Check browser console for errors (F12)
- Ensure JavaScript files loaded correctly
- Try refreshing the page

### **Missing Data After Import:**
- Check the import summary message
- Verify file contained expected data structure
- Try importing again with different file

---

## 🎯 **Best Practices**

1. **Regular Backups:** Export weekly to avoid data loss
2. **Validate Imports:** Always check import preview before confirming  
3. **Test First:** Try importing small test files first
4. **Multiple Formats:** Keep backups in both JSON and CSV
5. **Cloud Storage:** Use Google Drive integration for automatic sync

---

## 📞 **Need Help?**

- Check browser console (F12) for detailed error messages
- Verify file format matches examples above
- Try the Google Drive integration for seamless sync
- Contact support with specific error messages

Your theatre data is valuable - keep it safe with regular backups! 🎭✨

