## GDPR Compliance Statement

This project (StageLog) is a 100% client-side web application. By default, it does not transmit your data to any server we control. All data you enter is stored locally in your browser (localStorage) on your device.

What data is handled
- Performance logs you enter (e.g., show titles, dates, venues, ratings, expenses, notes)
- Optional personal notes you choose to store

Data collection and transmission
- No account system; no server-side storage by default
- No telemetry, analytics, or tracking beacons
- No cookies beyond browser storage primitives (localStorage) used for app preferences and your data
- Optional export/import features are user-initiated (e.g., file download/upload). If you activate a Google Drive export/restore, data is sent to your own Google account via Google's APIs under your control.
- **Device Sync Feature**: Optional Firebase real-time synchronization uses anonymous authentication. When enabled, your performance data is temporarily stored in Firebase Realtime Database (EU region: europe-west1, Belgium) for synchronization between your devices. Data is automatically deleted when you disconnect from sync rooms.

Roles under GDPR
- Data Controller: You (the user) control what data is created, stored, exported, or deleted on your device.
- Data Processor: When using device sync, Firebase (Google) acts as a data processor for temporary synchronization. Firebase's data processing is governed by their own privacy policy and GDPR compliance.

Lawful basis
- Not applicable for server-side processing, as we do not receive or process your personal data.

International data transfers
- None performed by us for local-only usage. If you export to third-party services (e.g., Google Drive), transfers occur under that provider's terms and your configuration.
- **Device Sync**: When using Firebase sync, data is stored on Google's EU servers (europe-west1 region, Belgium) and remains within the European Union. This ensures full GDPR compliance for data storage and processing.

Data retention
- Your data is stored locally until you delete it via the app's controls or your browser settings. You may clear local storage at any time.
- **Device Sync**: Sync data is temporarily stored in Firebase and automatically deleted when you disconnect from sync rooms or after a period of inactivity.

Data subject rights
- Because data is local and under your control, you can exercise access, rectification, erasure, restriction, portability, and objection by viewing, editing, exporting, or deleting the data in-app or clearing your browser storage.

Security
- Local-only by default. If you export data files, keep them secure. No secrets or credentials are stored by the app.

EU Data Storage Compliance
- **Device Sync**: All Firebase sync data is stored exclusively in the EU (europe-west1 region, Belgium)
- **No International Transfers**: Data remains within the European Union at all times
- **Google Compliance**: Firebase operates under Google's EU-U.S. Data Privacy Framework certification
- **GDPR Compliance**: Full compliance with EU data protection regulations

Subprocessors
- None for local-only usage. If you opt into Google Drive export, Google acts as an independent provider you engage directly.
- **Device Sync**: Firebase (Google) acts as a subprocessor for temporary data synchronization when you choose to use the sync feature. All data processing occurs within the EU (europe-west1 region, Belgium).

Breach notification
- Not applicable for our servers (none). For local-only storage, you control the device security.

Contact
- For questions about this statement, open an issue in the repository or contact the maintainer listed in `README.md`.

---

**Last Updated**: September 18, 2025  
**Version**: 2.6.0
