# 🎬 y2mate - Modern Video Downloader

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/yt--dlp-2026.3.17-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p align="center">
  <b>Download videos from YouTube and 1000+ sites with a beautiful, modern interface</b>
</p>

---

## ✨ Features

### 🎯 Core Capabilities
| Feature | Description |
|---------|-------------|
| **1000+ Sites** | YouTube, Twitter, Instagram, TikTok, Facebook, Vimeo, Twitch & more |
| **Multiple Formats** | MP4, WebM, MP3 (128k/192k/320k/Best) |
| **Real File Sizes** | See MB/KB before downloading |
| **One-Click Download** | Click any format → instant download |

### 🎨 UI/UX
- **SaaS-Grade Design** - Clean white cards, subtle shadows, professional layout
- **Fully Responsive** - Optimized for mobile, tablet & desktop
- **Lucide Icons** - Crisp, modern iconography throughout
- **Animated Interactions** - Smooth fade-ins, hover effects, loading spinners
- **Custom Favicon** - Branded blue gradient icon |

---

## 🚀 Quick Start

### Prerequisites
```bash
# Install yt-dlp (required for downloads)
pip install -U yt-dlp

# Ensure Node.js runtime is available (for YouTube)
node --version  # Should be 18+
```

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/bunny123373/y2mate.git
cd y2mate

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📸 How It Works

1. **Paste URL** - Enter any video URL (YouTube, Twitter, etc.)
2. **Fetch Info** - Click to load video details & available formats
3. **Choose Quality** - View file sizes for each format
4. **Click to Download** - Instant download starts in browser

### Supported Formats
- **Video**: 144p, 240p, 360p, 480p, 720p, 1080p, 4K, etc.
- **Audio**: MP3 128k, 192k, 320k, Best Quality
- **Container**: MP4, WebM, M4A, etc.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Custom animations |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes, Node.js Child Process |
| **Video Engine** | yt-dlp (Python) |

</div>

---

## 📁 Project Structure

```
y2mate/
├── app/
│   ├── page.tsx              # Main downloader page
│   ├── docs/
│   │   └── page.tsx          # Documentation
│   ├── api/
│   │   └── download/
│   │       └── route.ts      # Download API endpoint
│   ├── layout.tsx           # Root layout with metadata
│   └── globals.css          # Global styles
├── public/
│   ├── favicon.svg          # Custom SVG favicon
│   └── ...                   # Other static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new) for automatic deployments.

### Self-Hosted
```bash
# Build for production
npm run build

# Start production server
npm run start
```

---

## 📝 API Endpoint

### POST `/api/download`

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format_id": "best",  // or "mp3-128", "mp3-320", etc.
  "download": true
}
```

**Response:** File blob (direct download) or JSON with video info.

---

## ⚠️ Requirements

- **yt-dlp** must be installed and accessible in PATH
- **Node.js runtime** required for YouTube video extraction
- Modern browser with JavaScript enabled

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

<p align="center">
  <b>Built with ❤️ using Next.js & yt-dlp</b>
  <br />
  <a href="https://github.com/bunny123373/y2mate">GitHub</a> • 
  <a href="https://y2mate.vercel.app">Live Demo</a>
</p>
