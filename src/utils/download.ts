import { ref } from "vue";
import { useToast } from "vue-toastification";

interface DownloadOptions {
  url: string;
  fileName: string;
  fileSize: number;
  onProgress?: (progress: number) => void;
  maxRetries?: number;
  retryDelay?: number;
}

export function useFileDownload() {
  const downloading = ref(false);
  const progress = ref(0);
  const toast = useToast();

  const download = async ({
    url,
    fileName,
    fileSize,
    onProgress,
    maxRetries = 3,
    retryDelay = 1000,
  }: DownloadOptions) => {
    downloading.value = true;
    progress.value = 0;
    let retryCount = 0;

    const attemptDownload = async (): Promise<void> => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Download failed");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Failed to create reader");

        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;
          const currentProgress = Math.round((receivedLength / fileSize) * 100);
          progress.value = currentProgress;
          onProgress?.(currentProgress);
        }

        // 创建并下载文件
        const blob = new Blob(chunks);
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);

        toast.success("下载完成！");
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          toast.warning(`下载失败，正在进行第 ${retryCount} 次重试...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return attemptDownload();
        }
        toast.error("下载失败，请稍后重试");
        throw error;
      }
    };

    try {
      await attemptDownload();
    } catch (error) {
      console.error("下载失败:", error);
    } finally {
      downloading.value = false;
      progress.value = 0;
    }
  };

  return {
    downloading,
    progress,
    download,
  };
}
