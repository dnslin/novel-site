import type { CacheItem } from "@/types";
import heic2any from "heic2any";
// 缓存配置
const CACHE_KEY = "heic-image-cache";
const MAX_CACHE_SIZE = 50;
const CACHE_EXPIRE_DAYS = 7;

// 内存缓存容器
const memoryCache = new Map<string, string>();

// 从 localStorage 加载缓存
export const loadCache = (): Map<string, CacheItem> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return new Map();

    const parsedData = JSON.parse(cached);
    if (!Array.isArray(parsedData)) return new Map();

    const validEntries = parsedData.filter(([_, item]) => {
      return (
        item &&
        typeof item.url === "string" &&
        typeof item.data === "string" &&
        typeof item.timestamp === "number" &&
        item.data.startsWith("data:")
      );
    });

    return new Map(validEntries);
  } catch {
    return new Map();
  }
};

// 保存缓存到 localStorage
export const saveCache = (cache: Map<string, CacheItem>) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(Array.from(cache.entries()))
    );
  } catch (err) {
    console.error("保存缓存失败:", err);
  }
};

// 清理过期和超量的缓存
export const cleanCache = (cache: Map<string, CacheItem>) => {
  const now = Date.now();
  const expireTime = CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000;

  const items = Array.from(cache.entries());
  const validItems = items.filter(([_, item]) => {
    return now - item.timestamp <= expireTime;
  });

  if (validItems.length > MAX_CACHE_SIZE) {
    validItems.sort((a, b) => b[1].timestamp - a[1].timestamp);
    validItems.length = MAX_CACHE_SIZE;
  }

  return new Map(validItems);
};

// 检查是否为 HEIC/HEIF 图片
export const isHeic = (url: string): boolean => {
  const heicExtensions = [".heic", ".heif"];
  const lowercaseUrl = url.toLowerCase();

  return heicExtensions.some((ext) => {
    const extIndex = lowercaseUrl.indexOf(ext);
    if (extIndex === -1) return false;
    const afterExt = lowercaseUrl.charAt(extIndex + ext.length);
    return !afterExt || afterExt === "?" || afterExt === "#";
  });
};

// blob 转 base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// base64 转 blob
export const base64ToBlob = async (base64: string): Promise<Blob> => {
  try {
    if (!base64 || typeof base64 !== "string") {
      throw new Error("Invalid base64 data");
    }

    if (!base64.includes("data:")) {
      throw new Error("Invalid base64 format");
    }

    const [header, data] = base64.split(",");
    if (!header || !data) {
      throw new Error("Invalid base64 structure");
    }

    const mimeMatch = header.match(/data:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const byteCharacters = atob(data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  } catch (err) {
    console.error("Base64 转换失败:", err);
    throw err;
  }
};

// 转换 HEIC 图片为 JPEG
export const convertHeicToJpeg = async (url: string): Promise<string> => {
  if (memoryCache.has(url)) {
    return memoryCache.get(url)!;
  }

  const cache = loadCache();
  const cachedItem = cache.get(url);
  if (cachedItem?.data) {
    try {
      if (!cachedItem.data.startsWith("data:")) {
        throw new Error("Invalid cache data format");
      }

      const blob = await base64ToBlob(cachedItem.data);
      const objectUrl = URL.createObjectURL(blob);
      memoryCache.set(url, objectUrl);
      return objectUrl;
    } catch (err) {
      console.error("从缓存恢复失败:", err);
      cache.delete(url);
      saveCache(cache);
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();

    if (blob.type === "image/heic" || blob.type === "image/heif") {
      const convertedBlob = (await heic2any({
        blob,
        toType: "image/jpeg",
        quality: 0.8,
      })) as Blob;

      if (!convertedBlob) {
        throw new Error("Conversion failed");
      }

      const base64Data = await blobToBase64(convertedBlob);
      const objectUrl = URL.createObjectURL(convertedBlob);

      memoryCache.set(url, objectUrl);
      cache.set(url, {
        url,
        data: base64Data,
        timestamp: Date.now(),
      });

      const cleanedCache = cleanCache(cache);
      saveCache(cleanedCache);

      return objectUrl;
    } else if (
      blob.type === "image/jpeg" ||
      blob.type === "image/png" ||
      blob.type === "image/gif"
    ) {
      return url;
    } else {
      throw new Error("Unsupported image type: " + blob.type);
    }
  } catch (err) {
    console.error("HEIC 转换失败:", err);
    throw err;
  }
};

// 清理内存缓存
export const clearMemoryCache = () => {
  memoryCache.forEach((value) => {
    if (value.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }
  });
  memoryCache.clear();
};
