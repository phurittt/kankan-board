export function readStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback

  try { 
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T 
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!import.meta.client) return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // เช่น localStorage เต็ม หรือ private mode บาง browser ที่ปิด storage ไว้ — ปล่อยผ่าน ไม่ทำให้แอปพัง
  }
}