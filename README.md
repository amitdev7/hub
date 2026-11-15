# StorageHub — Premium Digital Resource Command Center

StorageHub is an enterprise-grade, full-stack digital resource launcher and command center built with **Next.js 16**, **React 18/19**, **TypeScript**, and **Tailwind CSS**, designed with an **Apple macOS × Stripe** visual aesthetic, **Arc** navigation, **Dropbox** file management, and **Raycast** quick access.

---

## ✨ Features

- **Apple macOS Visual Design**: Authentic macOS window frame with functional red, yellow, and green traffic light controls, acrylic frosted glass surfaces (`backdrop-blur-2xl`), refined rounded corners (`rounded-2xl`), and a floating bottom magnification Dock.
- **Dual Connected Surfaces**:
  - **Private Command Center (`/admin`)**: Authenticated administrative dashboard featuring Kanban Taskboard view, Resource Grid, My Files manager, Collections organizer, Starred Favorites, and Real-time Activity Audit logs.
  - **Public Resource Portal (`/`)**: High-aesthetic visitor-facing launcher showcasing public links, documents, search, collection pills, and QR code mobile sharing.
- **Drag-and-Drop Card Reordering**: Interactive reordering powered by `@dnd-kit` with atomic persistence to SQLite.
- **Raycast-Grade Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across resources, files, and collections with keyboard shortcuts and quick creation actions.
- **Dropbox-Inspired File Storage**:
  - Real persistent disk storage (`uploads/`).
  - Multi-file drag-and-drop upload dropzone with progress tracking.
  - In-browser file previewer supporting **PDF**, high-res **Images**, **Audio/Video**, and **Code/CSV/Text**.
  - Direct streaming downloads with safe `Content-Disposition` attachments and MIME sniffing protection.
- **Multi-Resource Support**: Web links, hosted file downloads, YouTube embeds, Google Drive assets, `mailto:` email dispatchers, `tel:` helplines, and device-specific local workstation references (`file:///...`).
- **Granular Privacy & Visibility Isolation**: Configure resources and files as either `Public` (visible on the public portal) or `Private` (strictly accessible only to the authenticated administrator).
- **Persistent SQLite Database (`data/storagehub.db`)**: High-performance SQLite engine with WAL mode and zero external daemon requirements.
- **Cryptographic Security**: PBKDF2 password hashing with random 16-byte salt, secure HTTP-only session cookies, and path traversal protection.
- **Light & Space Dark Themes**: Theme switching with CSS variable mapping.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v22+ recommended)
- **npm**: v9+

### 2. Installation
```bash
git clone <repository-url> StorageHub
cd StorageHub
npm install
```

### 3. Environment Setup
The application includes a ready-to-run `.env` file. You can adjust default credentials if desired:
```env
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpassword123
ADMIN_EMAIL=admin@storagehub.local
ADMIN_NAME=Peter Parker
SESSION_SECRET=storagehub_super_secret_session_key_production_grade_998877
NEXT_PUBLIC_APP_NAME="StorageHub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Build and Run
```bash
# Build for production
npm run build

# Start production server
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Default Credentials

- **Username / Email:** `admin` (or `admin@storagehub.local`)
- **Password:** `adminpassword123`
- **Admin Login Route:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📂 Project Architecture

```
StorageHub/
├── app/
│   ├── page.tsx                      # Public-Facing Visitor Portal
│   ├── layout.tsx                    # Root layout with theme hydration
│   ├── globals.css                   # macOS glassmorphism & Stripe tokens
│   ├── admin/
│   │   ├── layout.tsx                # macOS Window Container & Dock wrapper
│   │   ├── page.tsx                  # Command Center Overview (Taskboard & KPIs)
│   │   ├── resources/page.tsx        # All Links & Drag-and-Drop Reordering
│   │   ├── files/page.tsx            # File Management & Storage System
│   │   ├── collections/page.tsx      # Collections & Folders Manager
│   │   ├── favorites/page.tsx        # Starred Favorites
│   │   ├── recent/page.tsx           # Activity Audit History & Clear History
│   │   ├── appearance/page.tsx       # macOS Themes & Accent Colors
│   │   ├── settings/page.tsx         # Site Settings, Profile, JSON Backup
│   │   └── login/page.tsx            # macOS Glassmorphism Admin Login
│   └── api/
│       ├── auth/                     # login, logout, me
│       ├── resources/                # CRUD, reorder, click tracking
│       ├── collections/              # CRUD, reorder
│       ├── files/                    # list, upload, preview, download, delete
│       ├── search/                   # global multi-entity fuzzy search
│       ├── activity/                 # audit logs, clear
│       └── settings/                 # app configuration
├── components/
│   ├── CommandPalette.tsx            # Raycast cmdk menu (⌘K)
│   ├── MacWindowFrame.tsx            # Traffic lights & title bar
│   ├── MacSidebar.tsx                # Frosted glass floating sidebar
│   ├── MacDock.tsx                   # Bottom magnification desktop dock
│   ├── ResourceCard.tsx              # Draggable card with tags & context menu
│   ├── FileCard.tsx                  # File card with type icon & downloads
│   ├── FilePreviewModal.tsx          # Multi-format preview modal (PDF/Img/Code)
│   ├── FileUploadModal.tsx           # Multi-file dropzone with progress
│   ├── ResourceFormModal.tsx         # Resource create & edit dialog
│   ├── CollectionFormModal.tsx       # Collection create & edit dialog
│   ├── ShareModal.tsx                # QR code generator & copy link
│   ├── ThemeToggle.tsx               # Sun/Moon theme switcher
│   └── Toast.tsx                     # Toast notifications
├── lib/
│   ├── db.ts                         # SQLite schema, WAL mode, idempotent seeds
│   ├── auth.ts                       # PBKDF2 hashing & session management
│   ├── file-storage.ts               # Disk storage helpers & path sanitization
│   ├── types.ts                      # Full TypeScript interfaces
│   └── utils.ts                      # Formatters, byte calculation, MIME helpers
├── data/                             # Persistent SQLite storage (storagehub.db)
└── uploads/                          # Persistent disk storage for uploaded files
```

---

## 🧪 Testing

StorageHub comes with an automated test suite verifying all 20 requirements:
```bash
node test_storagehub.js
```
Expected output:
```
====================================================
TEST RESULTS: 21 PASSED, 0 FAILED
====================================================
```

---

## 📜 License
MIT License.
