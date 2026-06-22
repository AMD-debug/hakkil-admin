// Typage minimal du widget d'upload Cloudinary chargé via script global.
interface CloudinaryUploadResult {
  event?: string;
  info?: {
    secure_url?: string;
    [key: string]: unknown;
  };
}

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

interface CloudinaryUploadOptions {
  cloudName: string;
  uploadPreset: string;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  sources?: string[];
  [key: string]: unknown;
}

interface CloudinaryGlobal {
  createUploadWidget: (
    options: CloudinaryUploadOptions,
    callback: (error: unknown, result: CloudinaryUploadResult) => void,
  ) => CloudinaryWidget;
}

interface Window {
  cloudinary?: CloudinaryGlobal;
}
