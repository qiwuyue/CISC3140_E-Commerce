"use client";

import { useEffect, useState } from "react";

type ImageUploadProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
};

export default function ImageUpload({
  value,
  onChange,
  currentImageUrl,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl ?? null
  );

  useEffect(() => {
    if (!value) {
      setPreviewUrl(currentImageUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [value, currentImageUrl]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    onChange(file);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        Product Image
      </label>

      {previewUrl && (
        <div className="h-48 w-48 overflow-hidden rounded-lg border bg-gray-50">
          <img
            src={previewUrl}
            alt="Product preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <label
        htmlFor="product-image"
        className="flex cursor-pointer items-center justify-between rounded-md border border-gray-300 px-3 py-2 hover:border-gray-400"
      >
        <span className="truncate text-sm text-gray-500">
          {value ? value.name : "Select an image"}
        </span>

        <span className="ml-4 rounded bg-gray-100 px-3 py-1 text-sm font-medium">
          Browse
        </span>
      </label>

      <input
        id="product-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        JPG, PNG, or WebP. Max 5 MB.
      </p>
    </div>
  );
}