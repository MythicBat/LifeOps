export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
];

export function formatFileSize(bytes: number): string {
    if (bytes === 0) { return "0 Bytes"; }

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, index);

    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function validateFile(file: File): string | null {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        return "Upload a pdf, jpeg, png, or webp file.";
    }

    if (file.size > MAX_UPLOAD_SIZE) {
        return "Files must be smaller than 10MB.";
    }

    return null;
}