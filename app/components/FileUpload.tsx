"use client"; // This component must be a client component
//https://imagekit.io/docs/integration/nextjs#uploading-files

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress: (res: any) => void;
  fileType?: "image" | "video";
}

// FileUpload component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController(); //to provide an option to cancel the upload

  //optional: validation
  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Invalid file type");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File sixe more than 100 mb");
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const authResponse = await fetch("/api/auth/imagekit-auth");
      const auth = await authResponse.json();

      const res = await upload({
        file,
        fileName: file.name,
        expire: auth.expire,
        token: auth.token,
        signature: auth.signature,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,

        onProgress: (event) => {
          // Progress callback to update upload progress state
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
        // abortSignal: abortController.signal, // Abort signal to allow cancellation of the upload if needed.
      });
      onSuccess(res);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <span>Loading . . .</span>}
    </>
  );
};

export default FileUpload;
