# Security Policy

## 🛡️ Supported Versions

We actively maintain security for the following versions of StageLog:

| Version | Supported          |
| ------- | ------------------ |
| 2.8.x   | ✅ Yes             |
| 2.7.x   | ✅ Yes             |
| 2.6.x   | ✅ Yes             |
| 2.5.x   | ⚠️ Limited Support |
| < 2.5   | ❌ No              |

## 🚨 Reporting a Vulnerability

### **IMPORTANT: Do NOT report security vulnerabilities through public GitHub issues or discussions.**

### **How to Report:**

1. **Email:** Send details to [security@mayamccutcheon.com] (replace with your actual email)
2. **Subject Line:** Use format: `[SECURITY] StageLog v[version] - [brief description]`
3. **Include:**
   - Version of StageLog affected
   - Steps to reproduce the vulnerability
   - Potential impact
   - Any suggested fixes (if known)

### **What to Expect:**

- **Response Time:** We will acknowledge receipt within 48 hours
- **Assessment:** We will assess and validate the vulnerability within 7 days
- **Resolution:** We will work to resolve critical vulnerabilities within 30 days
- **Disclosure:** We will coordinate disclosure timing with you

### **Types of Vulnerabilities We Care About:**

- 🔐 **Authentication/Authorization bypasses**
- 💾 **Data exposure or leakage**
- 🛠️ **Code injection vulnerabilities**
- 🌐 **Cross-Site Scripting (XSS)**
- 📊 **Data validation issues**
- 🔄 **Session management flaws**
- 🗄️ **Database security issues**
- 🔑 **API key exposure or misuse**
- 🌍 **External API security (Google Maps, Wikidata, etc.)**

### **Out of Scope:**

- ❌ Social engineering attacks
- ❌ Physical security issues
- ❌ Issues requiring physical access to user devices
- ❌ Vulnerabilities in third-party services we don't control
- ❌ Denial of Service (DoS) attacks
- ❌ Spam or phishing attempts

## 🏆 Recognition

We appreciate security researchers who help keep StageLog secure! Contributors who report valid vulnerabilities will be:

- 📝 **Acknowledged** in our security advisories (with permission)
- 🏆 **Credited** in our release notes
- 🎉 **Thanked** publicly (if desired)

## 📋 Security Best Practices

### **For Users:**
- 🔄 Keep StageLog updated to the latest version
- 🔐 Use strong, unique passwords
- 🌐 Only download from official GitHub repository
- 📱 Keep your browser updated
- 🚫 Don't share your data files with untrusted sources

### **For Developers:**
- 🔍 Follow secure coding practices
- 🧪 Test security-critical changes thoroughly
- 📚 Stay informed about web security best practices
- 🔒 Use HTTPS for all external communications
- 🛡️ Validate all user inputs
- 🔑 **Never commit API keys** - Always use placeholders (`REPLACE_WITH_YOUR_*_API_KEY`)
- 🚫 **Configure API key restrictions** in Google Cloud Console (HTTP referrers, IP restrictions)
- 📝 **Use `.gitignore` patterns** to exclude sensitive files (`*api-key*`, `*secret*`, `*password*`)
- 🔐 **Review API key usage** regularly and rotate keys if compromised

## 🔗 Additional Resources

- [OWASP Web Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [StageLog Documentation](https://github.com/spike1478/stagelog#readme)

## 🔐 API Key Security (v2.8.0+)

StageLog v2.8.0 introduced Google Maps Places API integration. To ensure security:

### **API Key Management:**
- ✅ All API keys use secure placeholders in the codebase (`REPLACE_WITH_YOUR_*_API_KEY`)
- ✅ `.gitignore` patterns prevent accidental commits of sensitive files
- ✅ API keys are never stored in version control

### **Required API Keys:**
- **Google Maps API Key**: Required for location autocomplete features
  - Enable: "Places API (New)" and "Maps JavaScript API"
  - Set HTTP referrer restrictions in Google Cloud Console
  - Never commit the actual key to the repository

- **Firebase API Key** (optional): For device synchronization
  - Configure in Firebase Console
  - Set appropriate security rules
  - Use environment variables for production

### **Security Best Practices:**
1. **Get API keys** from official providers (Google Cloud Console, Firebase Console)
2. **Set API restrictions** (HTTP referrers, IP addresses) to limit usage
3. **Use placeholders** in code (`REPLACE_WITH_YOUR_MAPS_API_KEY`)
4. **Add keys locally** only - never commit them
5. **Rotate keys** if accidentally exposed
6. **Monitor usage** in provider dashboards for suspicious activity

### **If You Accidentally Commit an API Key:**
1. **Immediately revoke** the exposed key in the provider console
2. **Generate a new key** with the same restrictions
3. **Remove the key** from git history (if needed, use `git filter-branch` or BFG Repo-Cleaner)
4. **Update `.gitignore`** to prevent future commits
5. **Review access logs** for any unauthorized usage

---

**Last Updated:** November 8, 2025  
**Contact:** [security@mayamccutcheon.com]  
**Repository:** https://github.com/spike1478/stagelog
