import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const DB_PATH = path.join(DATA_DIR, 'storagehub.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'admin',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT DEFAULT 'Folder',
      color TEXT DEFAULT 'indigo',
      display_order INTEGER DEFAULT 0,
      is_public INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      stored_filename TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      category TEXT DEFAULT 'document',
      description TEXT,
      collection_id TEXT,
      visibility TEXT DEFAULT 'public',
      download_count INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      thumbnail TEXT,
      resource_type TEXT DEFAULT 'link',
      category TEXT DEFAULT 'General',
      collection_id TEXT,
      visibility TEXT DEFAULT 'public',
      is_favorite INTEGER DEFAULT 0,
      is_pinned INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      file_id TEXT,
      click_count INTEGER DEFAULT 0,
      tags TEXT DEFAULT '[]',
      custom_css TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE SET NULL,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      resource_id TEXT,
      action TEXT NOT NULL,
      details TEXT,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  seedDatabase();
}

function hashPasswordHelper(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

function seedDatabase() {
  const now = Date.now();
  const adminId = 'admin-user-0001-default-uuid';
  const passwordHash = hashPasswordHelper('adminpassword123');

  // Insert Admin if not present
  db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash, name, avatar, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    adminId,
    'admin',
    'admin@storagehub.local',
    passwordHash,
    'Peter Parker',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'admin',
    now
  );

  // Default Collections with fixed UUIDs for idempotent seeding
  const col1 = 'col-semester-7-uuid-0001';
  const col2 = 'col-dev-tools-uuid-0002';
  const col3 = 'col-design-media-uuid-0003';
  const col4 = 'col-important-docs-uuid-0004';

  const insertCol = db.prepare(`
    INSERT OR IGNORE INTO collections (id, name, slug, description, icon, color, display_order, is_public, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCol.run(col1, 'Semester 7', 'semester-7', 'Academic research, deliverables, and project milestones', 'FolderKanban', 'violet', 0, 1, now, now);
  insertCol.run(col2, 'Development Tools', 'dev-tools', 'Core engineering consoles, cloud consoles, and CLI documentation', 'Code2', 'blue', 1, 1, now, now);
  insertCol.run(col3, 'Design & Media', 'design-media', 'Brand identity assets, Figma canvases, and icon suites', 'Palette', 'pink', 2, 1, now, now);
  insertCol.run(col4, 'Important Documents', 'important-docs', 'Official specifications, legal forms, and quarterly spreadsheets', 'FileText', 'emerald', 3, 1, now, now);

  // Sample files on disk
  const file1Id = 'file-sys-arch-uuid-0001';
  const file1Stored = `${file1Id}-system_architecture.txt`;
  const file1Path = path.join(UPLOADS_DIR, file1Stored);
  if (!fs.existsSync(file1Path)) {
    fs.writeFileSync(
      file1Path,
      `STORAGEHUB ARCHITECTURE SPECIFICATION
=========================================
Platform: macOS x Stripe Premium Digital Resource Command Center
Database: Persistent SQLite with WAL mode
Storage: Local zero-leak persistent disk uploads
Design Tokens: Apple macOS Big Sur / Sonoma Glassmorphism + Stripe Typography

Security:
- PBKDF2 Password Hashing
- HTTP-Only Lax Session Cookies
- Isolated Public / Private Data Scopes
- Path Traversal & MIME Type Validation
`
    );
  }

  const file2Id = 'file-metrics-uuid-0002';
  const file2Stored = `${file2Id}-quarterly_metrics.csv`;
  const file2Path = path.join(UPLOADS_DIR, file2Stored);
  if (!fs.existsSync(file2Path)) {
    fs.writeFileSync(
      file2Path,
      `Quarter,Resources_Added,File_Storage_MB,Total_Clicks,Active_Collections
Q1 2026,142,482.5,3890,6
Q2 2026,215,750.2,5620,8
Q3 2026,380,1240.0,8910,12
Q4 2026,520,1890.4,14200,15
`
  );
  }

  const insertFile = db.prepare(`
    INSERT OR IGNORE INTO files (id, filename, stored_filename, file_size, mime_type, category, description, collection_id, visibility, download_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  if (fs.existsSync(file1Path)) {
    insertFile.run(
      file1Id,
      'System_Architecture_Blueprint.txt',
      file1Stored,
      Buffer.byteLength(fs.readFileSync(file1Path)),
      'text/plain',
      'document',
      'Full engineering architecture blueprint for StorageHub',
      col2,
      'public',
      18,
      now,
      now
    );
  }

  if (fs.existsSync(file2Path)) {
    insertFile.run(
      file2Id,
      'Quarterly_Resource_Metrics.csv',
      file2Stored,
      Buffer.byteLength(fs.readFileSync(file2Path)),
      'text/csv',
      'document',
      'Executive resource usage and traffic analytics spreadsheet',
      col4,
      'public',
      42,
      now,
      now
    );
  }

  // Insert Default Resources with fixed UUIDs
  const insertRes = db.prepare(`
    INSERT OR IGNORE INTO resources (
      id, title, url, description, icon, thumbnail, resource_type,
      category, collection_id, visibility, is_favorite, is_pinned,
      display_order, file_id, click_count, tags, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertRes.run(
    'res-stripe-0001',
    'Stripe Developer Dashboard',
    'https://dashboard.stripe.com',
    'Production payment gateway metrics, webhooks, and billing dashboard',
    'CreditCard',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    'link',
    'Finance',
    col2,
    'public',
    1,
    1,
    0,
    null,
    128,
    JSON.stringify(['Billing', 'API', 'Payments']),
    now,
    now
  );

  insertRes.run(
    'res-raycast-0002',
    'Raycast Extensions & Store',
    'https://www.raycast.com/store',
    'Quick launcher extensions, workflow automations, and productivity tools',
    'Command',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    'link',
    'Tools',
    col2,
    'public',
    1,
    0,
    1,
    null,
    94,
    JSON.stringify(['Raycast', 'Shortcuts', 'Mac']),
    now,
    now
  );

  insertRes.run(
    'res-figma-0003',
    'Brand Identity Assets & Guidelines',
    'https://www.figma.com',
    'Official vector logos, color tokens, and typography guidelines',
    'Sparkles',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&auto=format&fit=crop&q=80',
    'link',
    'Design',
    col3,
    'public',
    1,
    0,
    2,
    null,
    76,
    JSON.stringify(['Figma', 'Brand', 'Tokens']),
    now,
    now
  );

  insertRes.run(
    'res-file1-0004',
    'System Architecture Blueprint (Attached File)',
    `/api/files/${file1Id}/download`,
    'Engineering system design document stored persistently on StorageHub',
    'FileCode',
    null,
    'file',
    'Engineering',
    col2,
    'public',
    0,
    0,
    3,
    file1Id,
    34,
    JSON.stringify(['Specs', 'Architecture']),
    now,
    now
  );

  insertRes.run(
    'res-file2-0005',
    'Quarterly Resource Metrics CSV',
    `/api/files/${file2Id}/download`,
    'Downloadable CSV dataset with key platform metrics and volume',
    'Sheet',
    null,
    'file',
    'Finance',
    col4,
    'public',
    0,
    0,
    4,
    file2Id,
    51,
    JSON.stringify(['CSV', 'Metrics']),
    now,
    now
  );

  insertRes.run(
    'res-local-0006',
    'Internal Workspace Config (Local Ref)',
    'file:///C:/Users/amitk/Downloads/example.pdf',
    'Device-specific local file reference (Administrator workstation only)',
    'Monitor',
    null,
    'local_ref',
    'Internal',
    col1,
    'private',
    0,
    0,
    5,
    null,
    12,
    JSON.stringify(['Workstation', 'Private']),
    now,
    now
  );

  insertRes.run(
    'res-phone-0007',
    'Direct Support Hotline',
    'tel:+18005550199',
    'Immediate 24/7 technical operations helpline',
    'Phone',
    null,
    'phone',
    'Contact',
    col1,
    'public',
    0,
    0,
    6,
    null,
    9,
    JSON.stringify(['Support', 'Telephone']),
    now,
    now
  );

  insertRes.run(
    'res-mail-0008',
    'Engineering Inquiries Mailto',
    'mailto:peter.parker@storagehub.local',
    'Direct email dispatcher for resource requests and submissions',
    'Mail',
    null,
    'email',
    'Contact',
    col1,
    'public',
    0,
    0,
    7,
    null,
    23,
    JSON.stringify(['Email', 'Direct']),
    now,
    now
  );

  // App Settings
  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)
  `);

  insertSetting.run('siteTitle', 'StorageHub Command Center');
  insertSetting.run('siteDescription', 'A unified digital command center for files, curated links, and essential resources.');
  insertSetting.run('ownerName', 'Peter Parker');
  insertSetting.run('ownerBio', 'Senior Full-Stack Software Engineer & Digital Curator');
  insertSetting.run('ownerAvatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  insertSetting.run('accentColor', 'stripe-blue');
  insertSetting.run('defaultTheme', 'system');
  insertSetting.run('allowPublicDownloads', 'true');
  insertSetting.run('dockEnabled', 'true');
  insertSetting.run('trafficLightsEnabled', 'true');
}

initDatabase();

export default db;
