import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileCategory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return "-";
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(timestamp);
}

export function categorizeFile(mimeType: string, filename: string): FileCategory {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  if (
    mimeType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(ext)
  ) {
    return "image";
  }

  if (
    mimeType.startsWith("video/") ||
    mimeType.startsWith("audio/") ||
    ["mp4", "webm", "mp3", "wav", "ogg", "mov"].includes(ext)
  ) {
    return "media";
  }

  if (
    mimeType === "application/pdf" ||
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("presentation") ||
    mimeType.includes("spreadsheet") ||
    ["pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt", "txt", "rtf", "csv"].includes(ext)
  ) {
    return "document";
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("tar") ||
    mimeType.includes("compressed") ||
    ["zip", "tar", "gz", "7z", "rar"].includes(ext)
  ) {
    return "archive";
  }

  if (
    mimeType.includes("javascript") ||
    mimeType.includes("json") ||
    mimeType.includes("html") ||
    ["js", "ts", "tsx", "jsx", "json", "html", "css", "py", "sh", "sql", "yaml", "yml"].includes(ext)
  ) {
    return "code";
  }

  return "other";
}

export function sanitizeFilename(filename: string): string {
  // Strip path traversal characters and unwanted special chars
  return filename
    .replace(/^.*[\\/]/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 200);
}

export function isValidUrl(urlString: string): boolean {
  if (urlString.startsWith("mailto:") || urlString.startsWith("tel:") || urlString.startsWith("file:///")) {
    return true;
  }
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
