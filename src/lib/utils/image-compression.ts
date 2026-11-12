/**
 * Utility untuk mengonversi gambar (JPG, PNG, WEBP, AVIF, dll) ke format WebP
 * dan mengompres ukurannya agar maksimal ~1 MB (atau di bawah batas yang ditentukan).
 */
export async function convertAndCompressToWebP(
  file: File,
  maxSizeBytes: number = 1024 * 1024 // 1 MB
): Promise<{
  file: File;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}> {
  return new Promise((resolve, reject) => {
    // Validasi apakah file merupakan gambar
    if (!file.type.startsWith("image/")) {
      reject(new Error("File yang dipilih bukan gambar yang valid."));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Batasi resolusi maksimal 1920x1080 agar proporsional untuk web cover
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal memproses gambar pada canvas browser."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi bertahap agar ukuran file <= 1MB
        let quality = 0.88;

        const attemptCompression = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Gagal mengonversi gambar ke WebP."));
                return;
              }

              // Jika masih lebih besar dari 1MB dan kualitas masih bisa diturunkan
              if (blob.size > maxSizeBytes && q > 0.35) {
                attemptCompression(q - 0.12);
                return;
              }

              // Format nama file baru dengan ekstensi .webp
              const rawName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
              const cleanFileName = rawName.toLowerCase().replace(/[^a-z0-9_-]/g, "-") + ".webp";

              const webpFile = new File([blob], cleanFileName, {
                type: "image/webp",
                lastModified: Date.now(),
              });

              const reduction = Math.round(
                ((file.size - blob.size) / file.size) * 100
              );

              resolve({
                file: webpFile,
                originalSize: file.size,
                compressedSize: blob.size,
                reductionPercentage: reduction,
              });
            },
            "image/webp",
            q
          );
        };

        attemptCompression(quality);
      };

      img.onerror = () => reject(new Error("Gagal memuat gambar untuk proses konversi."));
    };

    reader.onerror = () => reject(new Error("Gagal membaca file dari komputer."));
  });
}

/**
 * Format ukuran byte ke format yang mudah dibaca (KB / MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
