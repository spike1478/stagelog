# 🎭 StageLog Unraid Setup Guide

## 📋 **What You'll Need:**
- Unraid server with Docker support
- Cloudflare account (free)
- Domain name (optional, but recommended)

## 🚀 **Step 1: Upload Files to Unraid**

1. **Create a folder** on your Unraid server (e.g., `/mnt/user/appdata/stagelog/`)
2. **Upload all StageLog files** to this folder:
   - `index.html`
   - `styles.css`
   - `app-fixed.js`
   - `stats-system.js`
   - `analytics-functions.js`
   - `restore-functions.js`
   - `database.js`
   - `api.js`
   - `csv-import.js`
   - `import-performances.js`
   - `musical-database.js`
   - `init-code.js`
   - `favicon.svg`
   - `docker-compose.yml`
   - `nginx.conf`

## 🐳 **Step 2: Deploy with Docker**

### **Option A: Using Unraid WebUI (Recommended)**

1. **Go to Unraid WebUI** → **Docker** tab
2. **Click "Add Container"** (this opens the Docker container creation form)

3. **Fill in the form fields** (here's what each field means and what to enter):

   **📝 Basic Settings:**
   - **Name**: `stagelog`
     - *This is what your container will be called in Unraid*
     - *Must be unique - no spaces or special characters*
   
   - **Repository**: `nginx:alpine`
     - *This tells Docker to use the official nginx web server image*
     - *"alpine" means it's a lightweight Linux version*
     - *Leave this exactly as shown*

   **🌐 Network Settings:**
   - **Network Type**: `bridge` (default)
     - *This allows the container to communicate with your network*
     - *Usually the default selection - don't change unless you know what you're doing*

   - **Port Mapping**: `17492:80`
     - *Format: `[external_port]:[internal_port]`*
     - *`17492` = port on your Unraid server (you'll access via this)*
     - *`80` = port inside the container (nginx's default port)*
     - *You can change 17492 to any port you prefer (like 8080, 9000, etc.)*

   **📁 Storage Settings:**
   - **Volume Mapping**: `/mnt/user/appdata/stagelog:/usr/share/nginx/html:ro`
     - *Format: `[host_path]:[container_path]:[options]`*
     - *`/mnt/user/appdata/stagelog` = your StageLog files folder on Unraid*
     - *`/usr/share/nginx/html` = where nginx looks for web files inside container*
     - *`:ro` = read-only (container can't modify your files)*
     - *Make sure the path matches where you uploaded your StageLog files*

   **🔄 Behavior Settings:**
   - **Restart Policy**: `unless-stopped`
     - *This means the container will automatically restart if it crashes*
     - *It won't restart if you manually stop it*
     - *Other options: "always" (always restart), "no" (never restart)*

4. **Click "Apply"** to create and start the container
   - *You should see a success message*
   - *The container will appear in your Docker list*
   - *Status should show as "running"*

### **Option B: Using Command Line (if you have docker-compose installed)**

1. **SSH into your Unraid server**
2. **Navigate to your StageLog folder**:
   ```bash
   cd /mnt/user/appdata/stagelog/
   ```
3. **Start the container**:
   ```bash
   docker-compose up -d
   ```

### **Option C: Using Docker Run Command**

1. **SSH into your Unraid server**
2. **Run this command**:
   ```bash
   docker run -d \
     --name stagelog \
     --restart unless-stopped \
     -p 17492:80 \
     -v /mnt/user/appdata/stagelog:/usr/share/nginx/html:ro \
     nginx:alpine
   ```

## ☁️ **Step 3: Set Up Cloudflare Tunnel**

### **Option A: Using Cloudflare Tunnel (Recommended)**

1. **Install cloudflared on Unraid**:
   ```bash
   # Download and install cloudflared
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   dpkg -i cloudflared.deb
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create a tunnel**:
   ```bash
   cloudflared tunnel create stagelog
   ```

4. **Configure the tunnel**:
   ```bash
   # Create config file
   nano ~/.cloudflared/config.yml
   ```
   
   Add this content:
   ```yaml
   tunnel: stagelog
   credentials-file: /root/.cloudflared/[tunnel-id].json
   
   ingress:
           - hostname: stagelog.yourdomain.com
        service: http://localhost:17492
     - service: http_status:404
   ```

5. **Start the tunnel**:
   ```bash
   cloudflared tunnel run stagelog
   ```

### **Option B: Using Unraid's Built-in Cloudflare Tunnel**

1. **Go to Unraid WebUI** → **Apps** → **Cloudflare Tunnel**
2. **Install the Cloudflare Tunnel plugin**
3. **Configure it to point to** `localhost:17492`

## 🌐 **Step 4: DNS Configuration**

1. **Go to your Cloudflare dashboard**
2. **Add a CNAME record**:
   - **Name**: `stagelog` (or whatever you want)
   - **Target**: `[tunnel-id].cfargotunnel.com`
   - **Proxy status**: Proxied (orange cloud)

## ✅ **Step 5: Test Your Setup**

1. **Visit your domain** (e.g., `https://stagelog.yourdomain.com`)
2. **Test all functionality**:
   - Add a show
   - Check analytics
   - Export/import data
   - Dark/light mode

## 🔧 **Troubleshooting**

### **Container won't start:**
```bash
# Check logs
docker logs stagelog

# Restart container
docker restart stagelog

# Or if using Unraid WebUI:
# Go to Docker tab → Click on stagelog container → Click "Restart"
```

### **Can't access from outside:**
- Check if port 17492 is accessible locally: `curl http://localhost:17492`
- Verify Cloudflare tunnel is running: `cloudflared tunnel list`
- Check DNS propagation: `nslookup stagelog.yourdomain.com`

### **Performance issues:**
- The nginx config includes gzip compression and caching
- Consider adding more RAM to your Unraid server if needed

## 🎯 **Benefits of This Setup:**

- ✅ **Access from anywhere** via your domain
- ✅ **HTTPS automatically** (Cloudflare handles SSL)
- ✅ **Fast loading** (nginx + gzip compression)
- ✅ **Secure** (behind Cloudflare's protection)
- ✅ **Easy updates** (just replace files and restart container)

## 🔄 **Updating StageLog:**

1. **Upload new files** to your Unraid folder
2. **Restart the container**:
   ```bash
   docker restart stagelog
   ```
   
   **Or using Unraid WebUI:**
   - Go to **Docker** tab
   - Click on **stagelog** container
   - Click **"Restart"**

That's it! Your StageLog will be accessible from anywhere in the world! 🌍🎭✨
