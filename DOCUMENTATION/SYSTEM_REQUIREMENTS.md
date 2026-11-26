# AERVYN: ECHOES OF TIME — System Requirements & Compatibility

This document specifies the client-side and server-side hardware and software requirements for running **AERVYN: ECHOES OF TIME**.

---

## 1. Client Browser Requirements (End Players & Buyers)

AERVYN is engineered to execute in any standard web browser with WebGL 2.0 capabilities. No desktop game installation, Steam launcher, or emulator is needed.

### Minimum Specifications (30+ FPS Performance)
- **Operating System:** Windows 10/11 (64-bit), macOS 12 (Monterey) or newer, Ubuntu Linux 22.04 LTS+, iOS 15+, Android 11+
- **Web Browser:** Google Chrome 95+, Microsoft Edge 95+, Mozilla Firefox 95+, Apple Safari 15+
- **Graphics API:** WebGL 2.0 compatible hardware with Hardware Acceleration enabled
- **System Memory (RAM):** 4 GB total (at least 1.5 GB available memory)
- **Processor:** Intel Core i3 (6th Gen) / AMD Ryzen 3 equivalent or modern mobile ARM processor (Apple A13, Snapdragon 700 series)
- **Network Connection:** 2 Mbps broadband connection (only for initial load and save syncing)
- **Input Devices:** Standard Keyboard & Mouse, Gamepad (Xbox/PlayStation via Gamepad API), or Touch Gestures

### Recommended Specifications (60+ FPS Ultra Experience)
- **Operating System:** Windows 11 (64-bit), macOS 14+ (Sonoma), modern 64-bit Linux distribution
- **Web Browser:** Latest Google Chrome, Brave, or Firefox with hardware-accelerated canvas
- **Graphics Processing Unit (GPU):** Dedicated GPU — NVIDIA GeForce GTX 1060 / AMD Radeon RX 580 / Apple Silicon (M1/M2/M3/M4) or higher
- **System Memory (RAM):** 8 GB to 16 GB high-speed RAM
- **Display:** 1080p, 1440p, or 4K resolution at 60Hz or 120Hz refresh rate
- **Input Devices:** Mechanical Keyboard, Precision Optical Mouse, or Wireless Gamepad

---

## 2. Server Infrastructure Requirements (Self-Hosting & Commercial Deployment)

### Minimum Server Tier (Development / Low Traffic)
- **Compute:** 1 vCPU / 2.0 GHz
- **Memory:** 2 GB RAM
- **Storage:** 10 GB SSD / NVMe
- **Operating System:** Ubuntu 22.04 LTS / Debian 12 / Rocky Linux 9
- **Database:** MySQL 8.0 or MariaDB 10.6

### Recommended Production Server Tier (Commercial Portal / High Concurrency)
- **Compute:** 4 vCPUs / 3.0+ GHz
- **Memory:** 8 GB to 16 GB ECC RAM
- **Storage:** 40 GB NVMe Storage
- **Network Bandwidth:** 1 Gbps unmetered connection
- **Database:** Dedicated or managed MySQL 8.0 instance with connection pooling
- **Web Server:** Nginx 1.24+ with HTTP/2 and gzip/brotli compression enabled
- **PHP:** PHP 8.2 or 8.3 FPM with OPcache enabled
