import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'uploads');
const DB_JSON_PATH = path.join(DATA_DIR, 'storagehub_store.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // ignore
}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // ignore
}

export interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  name: string;
  avatar: string | null;
  role: string;
  created_at: number;
}

export interface SessionRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: number;
  created_at: number;
}

export interface CollectionRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  display_order: number;
  is_public: number;
  created_at: number;
  updated_at: number;
}

export interface FileRow {
  id: string;
  filename: string;
  stored_filename: string;
  file_size: number;
  mime_type: string;
  category: string;
  description: string | null;
  collection_id: string | null;
  visibility: string;
  download_count: number;
  created_at: number;
  updated_at: number;
}

export interface ResourceRow {
  id: string;
  title: string;
  url: string;
  description: string | null;
  icon: string | null;
  thumbnail: string | null;
  resource_type: string;
  category: string;
  collection_id: string | null;
  visibility: string;
  is_favorite: number;
  is_pinned: number;
  display_order: number;
  file_id: string | null;
  click_count: number;
  tags: string;
  custom_css?: string | null;
  created_at: number;
  updated_at: number;
}

export interface ActivityRow {
  id: string;
  resource_id: string | null;
  action: string;
  details: string | null;
  timestamp: number;
}

class StorageEngine {
  users: Map<string, UserRow> = new Map();
  sessions: Map<string, SessionRow> = new Map();
  collections: Map<string, CollectionRow> = new Map();
  files: Map<string, FileRow> = new Map();
  resources: Map<string, ResourceRow> = new Map();
  activity_logs: ActivityRow[] = [];
  app_settings: Map<string, string> = new Map();

  constructor() {
    this.loadState();
    if (this.users.size === 0) {
      this.seed();
    }
  }

  saveState() {
    try {
      const data = {
        users: Array.from(this.users.values()),
        sessions: Array.from(this.sessions.values()),
        collections: Array.from(this.collections.values()),
        files: Array.from(this.files.values()),
        resources: Array.from(this.resources.values()),
        activity_logs: this.activity_logs,
        app_settings: Array.from(this.app_settings.entries()),
      };
      fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // ignore write errors in restricted environments
    }
  }

  loadState() {
    try {
      if (fs.existsSync(DB_JSON_PATH)) {
        const raw = fs.readFileSync(DB_JSON_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (data.users) data.users.forEach((u: UserRow) => this.users.set(u.id, u));
        if (data.sessions) data.sessions.forEach((s: SessionRow) => this.sessions.set(s.token, s));
        if (data.collections) data.collections.forEach((c: CollectionRow) => this.collections.set(c.id, c));
        if (data.files) data.files.forEach((f: FileRow) => this.files.set(f.id, f));
        if (data.resources) data.resources.forEach((r: ResourceRow) => this.resources.set(r.id, r));
        if (data.activity_logs) this.activity_logs = data.activity_logs;
        if (data.app_settings) data.app_settings.forEach(([k, v]: [string, string]) => this.app_settings.set(k, v));
      }
    } catch {
      // ignore
    }
  }

  seed() {
    const now = Date.now();
    const adminId = 'admin-user-0001-default-uuid';
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('adminpassword123', salt, 100000, 64, 'sha512').toString('hex');
    const passwordHash = `${salt}:${hash}`;

    this.users.set(adminId, {
      id: adminId,
      username: 'admin',
      email: 'admin@storagehub.local',
      password_hash: passwordHash,
      name: 'Peter Parker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      created_at: now,
    });

    const col1 = 'col-semester-7-uuid-0001';
    const col2 = 'col-dev-tools-uuid-0002';
    const col3 = 'col-design-media-uuid-0003';
    const col4 = 'col-important-docs-uuid-0004';

    this.collections.set(col1, { id: col1, name: 'Semester 7', slug: 'semester-7', description: 'Academic research, deliverables, and project milestones', icon: 'FolderKanban', color: 'violet', display_order: 0, is_public: 1, created_at: now, updated_at: now });
    this.collections.set(col2, { id: col2, name: 'Development Tools', slug: 'dev-tools', description: 'Core engineering consoles, cloud consoles, and CLI documentation', icon: 'Code2', color: 'blue', display_order: 1, is_public: 1, created_at: now, updated_at: now });
    this.collections.set(col3, { id: col3, name: 'Design & Media', slug: 'design-media', description: 'Brand identity assets, Figma canvases, and icon suites', icon: 'Palette', color: 'pink', display_order: 2, is_public: 1, created_at: now, updated_at: now });
    this.collections.set(col4, { id: col4, name: 'Important Documents', slug: 'important-docs', description: 'Official specifications, legal forms, and quarterly spreadsheets', icon: 'FileText', color: 'emerald', display_order: 3, is_public: 1, created_at: now, updated_at: now });

    const file1Id = 'file-sys-arch-uuid-0001';
    const file2Id = 'file-metrics-uuid-0002';

    this.files.set(file1Id, {
      id: file1Id,
      filename: 'System_Architecture_Blueprint.txt',
      stored_filename: `${file1Id}-system_architecture.txt`,
      file_size: 420,
      mime_type: 'text/plain',
      category: 'document',
      description: 'Full engineering architecture blueprint for StorageHub',
      collection_id: col2,
      visibility: 'public',
      download_count: 18,
      created_at: now,
      updated_at: now,
    });

    this.files.set(file2Id, {
      id: file2Id,
      filename: 'Quarterly_Resource_Metrics.csv',
      stored_filename: `${file2Id}-quarterly_metrics.csv`,
      file_size: 210,
      mime_type: 'text/csv',
      category: 'document',
      description: 'Executive resource usage and traffic analytics spreadsheet',
      collection_id: col4,
      visibility: 'public',
      download_count: 42,
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-stripe-0001', {
      id: 'res-stripe-0001',
      title: 'Stripe Developer Dashboard',
      url: 'https://dashboard.stripe.com',
      description: 'Production payment gateway metrics, webhooks, and billing dashboard',
      icon: 'CreditCard',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      resource_type: 'link',
      category: 'Finance',
      collection_id: col2,
      visibility: 'public',
      is_favorite: 1,
      is_pinned: 1,
      display_order: 0,
      file_id: null,
      click_count: 128,
      tags: JSON.stringify(['Billing', 'API', 'Payments']),
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-raycast-0002', {
      id: 'res-raycast-0002',
      title: 'Raycast Extensions & Store',
      url: 'https://www.raycast.com/store',
      description: 'Quick launcher extensions, workflow automations, and productivity tools',
      icon: 'Command',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      resource_type: 'link',
      category: 'Tools',
      collection_id: col2,
      visibility: 'public',
      is_favorite: 1,
      is_pinned: 0,
      display_order: 1,
      file_id: null,
      click_count: 94,
      tags: JSON.stringify(['Raycast', 'Shortcuts', 'Mac']),
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-figma-0003', {
      id: 'res-figma-0003',
      title: 'Brand Identity Assets & Guidelines',
      url: 'https://www.figma.com',
      description: 'Official vector logos, color tokens, and typography guidelines',
      icon: 'Sparkles',
      thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&auto=format&fit=crop&q=80',
      resource_type: 'link',
      category: 'Design',
      collection_id: col3,
      visibility: 'public',
      is_favorite: 1,
      is_pinned: 0,
      display_order: 2,
      file_id: null,
      click_count: 76,
      tags: JSON.stringify(['Figma', 'Brand', 'Tokens']),
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-file1-0004', {
      id: 'res-file1-0004',
      title: 'System Architecture Blueprint (Attached File)',
      url: `/api/files/${file1Id}/download`,
      description: 'Engineering system design document stored persistently on StorageHub',
      icon: 'FileCode',
      thumbnail: null,
      resource_type: 'file',
      category: 'Engineering',
      collection_id: col2,
      visibility: 'public',
      is_favorite: 0,
      is_pinned: 0,
      display_order: 3,
      file_id: file1Id,
      click_count: 34,
      tags: JSON.stringify(['Specs', 'Architecture']),
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-file2-0005', {
      id: 'res-file2-0005',
      title: 'Quarterly Resource Metrics CSV',
      url: `/api/files/${file2Id}/download`,
      description: 'Downloadable CSV dataset with key platform metrics and volume',
      icon: 'Sheet',
      thumbnail: null,
      resource_type: 'file',
      category: 'Finance',
      collection_id: col4,
      visibility: 'public',
      is_favorite: 0,
      is_pinned: 0,
      display_order: 4,
      file_id: file2Id,
      click_count: 51,
      tags: JSON.stringify(['CSV', 'Metrics']),
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-phone-0007', {
      id: 'res-phone-0007',
      title: 'Direct Support Hotline',
      url: 'tel:+18005550199',
      description: 'Immediate 24/7 technical operations helpline',
      icon: 'Phone',
      thumbnail: null,
      resource_type: 'phone',
      category: 'Contact',
      collection_id: col1,
      visibility: 'public',
      is_favorite: 0,
      is_pinned: 0,
      display_order: 5,
      file_id: null,
      click_count: 9,
      tags: JSON.stringify(['Support', 'Telephone']),
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-mail-0008', {
      id: 'res-mail-0008',
      title: 'Engineering Inquiries Mailto',
      url: 'mailto:peter.parker@storagehub.local',
      description: 'Direct email dispatcher for resource requests and submissions',
      icon: 'Mail',
      thumbnail: null,
      resource_type: 'email',
      category: 'Contact',
      collection_id: col1,
      visibility: 'public',
      is_favorite: 0,
      is_pinned: 0,
      display_order: 6,
      file_id: null,
      click_count: 23,
      tags: JSON.stringify(['Email', 'Direct']),
      created_at: now,
      updated_at: now,
    });

    this.resources.set('res-private-0009', {
      id: 'res-private-0009',
      title: 'Internal Admin Workstation Notes',
      url: 'https://internal.storagehub.local/notes',
      description: 'Private workstation telemetry and internal infrastructure credentials',
      icon: 'Lock',
      thumbnail: null,
      resource_type: 'link',
      category: 'Tools',
      collection_id: col2,
      visibility: 'private',
      is_favorite: 1,
      is_pinned: 1,
      display_order: 7,
      file_id: null,
      click_count: 5,
      tags: JSON.stringify(['Private', 'Internal', 'Ops']),
      created_at: now,
      updated_at: now,
    });

    this.app_settings.set('siteTitle', 'StorageHub Command Center');
    this.app_settings.set('siteDescription', 'A unified digital command center for files, curated links, and essential resources.');
    this.app_settings.set('ownerName', 'Peter Parker');
    this.app_settings.set('ownerBio', 'Senior Full-Stack Software Engineer & Digital Curator');
    this.app_settings.set('ownerAvatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    this.app_settings.set('accentColor', 'stripe-blue');
    this.app_settings.set('defaultTheme', 'system');
    this.app_settings.set('allowPublicDownloads', 'true');
    this.app_settings.set('dockEnabled', 'true');
    this.app_settings.set('trafficLightsEnabled', 'true');

    this.saveState();
  }
}

const engine = new StorageEngine();

export const db = {
  exec(_sql: string) {
    // schema creation is handled in-memory
  },
  pragma(_sql: string) {
    // pragma is a no-op
  },
  transaction<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: any[]) => {
      const result = fn(...args);
      engine.saveState();
      return result;
    }) as T;
  },
  prepare(sql: string) {
    const cleanSql = sql.replace(/\s+/g, ' ').trim();
    const upper = cleanSql.toUpperCase();

    return {
      run(...args: any[]) {
        let changes = 0;

        // INSERT INTO collections
        if (upper.startsWith('INSERT INTO COLLECTIONS') || upper.startsWith('INSERT OR IGNORE INTO COLLECTIONS')) {
          const [id, name, slug, description, icon, color, display_order, is_public, created_at, updated_at] = args;
          if (!engine.collections.has(id)) {
            engine.collections.set(id, { id, name, slug, description, icon, color, display_order, is_public, created_at, updated_at });
            changes = 1;
          }
        }
        // UPDATE collections
        else if (upper.startsWith('UPDATE COLLECTIONS')) {
          if (upper.includes('SET DISPLAY_ORDER = ? WHERE ID = ?')) {
            const [order, id] = args;
            const c = engine.collections.get(id);
            if (c) {
              c.display_order = order;
              changes = 1;
            }
          } else {
            const [name, slug, description, icon, color, is_public, updated_at, id] = args;
            const c = engine.collections.get(id);
            if (c) {
              if (name !== null) c.name = name;
              if (slug !== null) c.slug = slug;
              if (description !== null) c.description = description;
              if (icon !== null) c.icon = icon;
              if (color !== null) c.color = color;
              if (is_public !== null) c.is_public = is_public;
              c.updated_at = updated_at;
              changes = 1;
            }
          }
        }
        // DELETE FROM collections
        else if (upper.startsWith('DELETE FROM COLLECTIONS')) {
          const [id] = args;
          if (engine.collections.delete(id)) {
            // Unlink resources
            for (const r of engine.resources.values()) {
              if (r.collection_id === id) r.collection_id = null;
            }
            changes = 1;
          }
        }
        // INSERT INTO resources
        else if (upper.startsWith('INSERT INTO RESOURCES') || upper.startsWith('INSERT OR IGNORE INTO RESOURCES')) {
          const [id, title, url, description, icon, thumbnail, resource_type, category, collection_id, visibility, is_favorite, is_pinned, display_order, file_id, click_count, tags, created_at, updated_at] = args;
          if (!engine.resources.has(id)) {
            engine.resources.set(id, { id, title, url, description, icon, thumbnail, resource_type, category, collection_id, visibility, is_favorite, is_pinned, display_order, file_id, click_count, tags, created_at, updated_at });
            changes = 1;
          }
        }
        // UPDATE resources
        else if (upper.startsWith('UPDATE RESOURCES')) {
          if (upper.includes('SET CLICK_COUNT = CLICK_COUNT + 1')) {
            const [id] = args;
            const r = engine.resources.get(id);
            if (r) {
              r.click_count = (r.click_count || 0) + 1;
              changes = 1;
            }
          } else if (upper.includes('SET DISPLAY_ORDER = ? WHERE ID = ?')) {
            const [order, id] = args;
            const r = engine.resources.get(id);
            if (r) {
              r.display_order = order;
              changes = 1;
            }
          } else {
            const [title, url, description, icon, thumbnail, resource_type, category, collection_id, visibility, is_favorite, is_pinned, tags, custom_css, updated_at, id] = args;
            const r = engine.resources.get(id);
            if (r) {
              if (title !== null) r.title = title;
              if (url !== null) r.url = url;
              if (description !== null) r.description = description;
              if (icon !== null) r.icon = icon;
              if (thumbnail !== null) r.thumbnail = thumbnail;
              if (resource_type !== null) r.resource_type = resource_type;
              if (category !== null) r.category = category;
              if (collection_id !== null) r.collection_id = collection_id;
              if (visibility !== null) r.visibility = visibility;
              if (is_favorite !== null) r.is_favorite = is_favorite;
              if (is_pinned !== null) r.is_pinned = is_pinned;
              if (tags !== null) r.tags = tags;
              if (custom_css !== null) r.custom_css = custom_css;
              r.updated_at = updated_at;
              changes = 1;
            }
          }
        }
        // DELETE FROM resources
        else if (upper.startsWith('DELETE FROM RESOURCES')) {
          const [id] = args;
          if (engine.resources.delete(id)) changes = 1;
        }
        // INSERT INTO files
        else if (upper.startsWith('INSERT INTO FILES') || upper.startsWith('INSERT OR IGNORE INTO FILES')) {
          const [id, filename, stored_filename, file_size, mime_type, category, description, collection_id, visibility, download_count, created_at, updated_at] = args;
          if (!engine.files.has(id)) {
            engine.files.set(id, { id, filename, stored_filename, file_size, mime_type, category, description, collection_id, visibility, download_count, created_at, updated_at });
            changes = 1;
          }
        }
        // UPDATE files
        else if (upper.startsWith('UPDATE FILES')) {
          if (upper.includes('SET DOWNLOAD_COUNT = DOWNLOAD_COUNT + 1')) {
            const [id] = args;
            const f = engine.files.get(id);
            if (f) {
              f.download_count = (f.download_count || 0) + 1;
              changes = 1;
            }
          } else {
            const [filename, description, collection_id, visibility, category, updated_at, id] = args;
            const f = engine.files.get(id);
            if (f) {
              if (filename !== null) f.filename = filename;
              if (description !== null) f.description = description;
              if (collection_id !== null) f.collection_id = collection_id;
              if (visibility !== null) f.visibility = visibility;
              if (category !== null) f.category = category;
              f.updated_at = updated_at;
              changes = 1;
            }
          }
        }
        // DELETE FROM files
        else if (upper.startsWith('DELETE FROM FILES')) {
          const [id] = args;
          if (engine.files.delete(id)) changes = 1;
        }
        // INSERT INTO activity_logs
        else if (upper.startsWith('INSERT INTO ACTIVITY_LOGS')) {
          const [id, resource_id, action, details, timestamp] = args;
          engine.activity_logs.unshift({ id, resource_id, action, details, timestamp });
          if (engine.activity_logs.length > 200) engine.activity_logs.pop();
          changes = 1;
        }
        // DELETE FROM activity_logs
        else if (upper.startsWith('DELETE FROM ACTIVITY_LOGS')) {
          engine.activity_logs = [];
          changes = 1;
        }
        // INSERT INTO app_settings
        else if (upper.startsWith('INSERT INTO APP_SETTINGS') || upper.startsWith('INSERT OR IGNORE INTO APP_SETTINGS')) {
          const [key, value] = args;
          engine.app_settings.set(key, value);
          changes = 1;
        }
        // INSERT INTO sessions
        else if (upper.startsWith('INSERT INTO SESSIONS')) {
          const [id, user_id, token, expires_at, created_at] = args;
          engine.sessions.set(token, { id, user_id, token, expires_at, created_at });
          changes = 1;
        }
        // DELETE FROM sessions
        else if (upper.startsWith('DELETE FROM SESSIONS')) {
          const [token] = args;
          if (engine.sessions.delete(token)) changes = 1;
        }
        // INSERT INTO users
        else if (upper.startsWith('INSERT INTO USERS') || upper.startsWith('INSERT OR IGNORE INTO USERS')) {
          const [id, username, email, password_hash, name, avatar, role, created_at] = args;
          if (!engine.users.has(id)) {
            engine.users.set(id, { id, username, email, password_hash, name, avatar, role, created_at });
            changes = 1;
          }
        }

        engine.saveState();
        return { changes, lastInsertRowid: 0 };
      },

      get(...args: any[]): any {
        // SELECT id FROM collections WHERE slug = ?
        if (upper.includes('FROM COLLECTIONS WHERE SLUG = ?')) {
          const [slug] = args;
          for (const c of engine.collections.values()) {
            if (c.slug === slug) return { id: c.id };
          }
          return null;
        }
        // SELECT MAX(display_order) as maxOrder FROM collections
        if (upper.includes('SELECT MAX(DISPLAY_ORDER) AS MAXORDER FROM COLLECTIONS')) {
          let maxOrder = -1;
          for (const c of engine.collections.values()) {
            if (c.display_order > maxOrder) maxOrder = c.display_order;
          }
          return { maxOrder: maxOrder === -1 ? null : maxOrder };
        }
        // SELECT MAX(display_order) as maxOrder FROM resources
        if (upper.includes('SELECT MAX(DISPLAY_ORDER) AS MAXORDER FROM RESOURCES')) {
          let maxOrder = -1;
          for (const r of engine.resources.values()) {
            if (r.display_order > maxOrder) maxOrder = r.display_order;
          }
          return { maxOrder: maxOrder === -1 ? null : maxOrder };
        }
        // SELECT * FROM resources WHERE id = ?
        if (upper.includes('FROM RESOURCES WHERE ID = ?')) {
          const [id] = args;
          return engine.resources.get(id) || null;
        }
        // SELECT * FROM files WHERE id = ?
        if (upper.includes('FROM FILES WHERE ID = ?')) {
          const [id] = args;
          return engine.files.get(id) || null;
        }
        // SELECT stored_filename, filename FROM files WHERE id = ?
        if (upper.includes('STORED_FILENAME, FILENAME FROM FILES WHERE ID = ?')) {
          const [id] = args;
          const f = engine.files.get(id);
          return f ? { stored_filename: f.stored_filename, filename: f.filename } : null;
        }
        // SELECT * FROM users WHERE username = ? OR email = ?
        if (upper.includes('FROM USERS WHERE USERNAME = ? OR EMAIL = ?')) {
          const [ident1, ident2] = args;
          for (const u of engine.users.values()) {
            if (u.username === ident1 || u.email === ident2) return u;
          }
          return null;
        }
        // SELECT u.* FROM sessions s JOIN users u ...
        if (upper.includes('FROM SESSIONS S') && upper.includes('JOIN USERS U')) {
          const [token, now] = args;
          const s = engine.sessions.get(token);
          if (s && s.expires_at > (now || Date.now())) {
            const u = engine.users.get(s.user_id);
            if (u) {
              return {
                ...s,
                ...u,
                u_id: u.id,
                u_created_at: u.created_at,
              };
            }
          }
          return null;
        }

        return null;
      },

      all(...args: any[]): any[] {
        // SELECT key, value FROM app_settings
        if (upper.includes('FROM APP_SETTINGS')) {
          return Array.from(engine.app_settings.entries()).map(([key, value]) => ({ key, value }));
        }

        // SELECT * FROM collections ORDER BY display_order ASC
        if (upper.includes('FROM COLLECTIONS')) {
          const list = Array.from(engine.collections.values());
          list.sort((a, b) => a.display_order - b.display_order);
          return list;
        }

        // SELECT a.*, r.title as resource_title FROM activity_logs
        if (upper.includes('FROM ACTIVITY_LOGS')) {
          return engine.activity_logs.slice(0, 50).map((a) => {
            const r = a.resource_id ? engine.resources.get(a.resource_id) : null;
            return {
              ...a,
              resource_title: r ? r.title : null,
            };
          });
        }

        // SELECT * FROM files ...
        if (upper.includes('FROM FILES') && !upper.includes('RESOURCES')) {
          let list = Array.from(engine.files.values());
          if (args.length > 0) {
            // Apply simple filter if parameters exist
            if (upper.includes('VISIBILITY = ?')) {
              list = list.filter((f) => f.visibility === args[0]);
            }
          }
          list.sort((a, b) => b.created_at - a.created_at);
          return list;
        }

        // SELECT r.* ... FROM resources r ...
        if (upper.includes('FROM RESOURCES')) {
          let list = Array.from(engine.resources.values()).map((r) => {
            const col = r.collection_id ? engine.collections.get(r.collection_id) : null;
            const fil = r.file_id ? engine.files.get(r.file_id) : null;
            return {
              ...r,
              collection_name: col ? col.name : null,
              collection_color: col ? col.color : null,
              file_name: fil ? fil.filename : null,
              file_size: fil ? fil.file_size : null,
              file_mime: fil ? fil.mime_type : null,
            };
          });

          // Check for public filter
          if (cleanSql.includes("r.visibility = 'public'")) {
            list = list.filter((r) => r.visibility === 'public');
          }

          list.sort((a, b) => a.display_order - b.display_order);
          return list;
        }

        return [];
      },
    };
  },
};

export function initDatabase() {
  // Handled in StorageEngine constructor
}

export default db;
