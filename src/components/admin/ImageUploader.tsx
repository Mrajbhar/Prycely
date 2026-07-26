import { useRef, useState } from 'react';
import { uploadApi } from '../../features/upload/uploadApi';
import { assetUrl } from '../../lib/assetUrl';
import { useToast } from '../ui/Toast';
import { Spinner } from '../ui/Spinner';
import { ApiError } from '../../types/api';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUploader({ value, onChange, max = 8 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const toast = useToast();

  const remaining = max - value.length;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) {
      toast.show(`Maximum ${max} images.`);
      return;
    }

    setUploading(true);
    try {
      // Sequential — keeps error handling simple and order predictable.
      const urls: string[] = [];
      for (const file of toUpload) {
        const { url } = await uploadApi.image(file);
        urls.push(url);
      }
      onChange([...value, ...urls]);
    } catch (err) {
      toast.show(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-ink">Images</span>

      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={url}
            className="group relative size-24 overflow-hidden rounded-lg border border-line"
          >
            <img src={assetUrl(url)} alt="" className="size-full object-cover" />

            {/* First image is the primary — flag it. */}
            {i === 0 && (
              <span className="price absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                Main
              </span>
            )}

            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-ink/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFiles(e.dataTransfer.files);
            }}
            className={`grid size-24 place-items-center rounded-lg border-2 border-dashed text-xs transition-colors ${
              dragging ? 'border-brand bg-brand-tint text-brand' : 'border-line text-muted hover:border-ink-soft'
            }`}
          >
            {uploading ? <Spinner className="text-brand" /> : <span>+ Add</span>}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted">
        First image is the main one. JPG, PNG, WebP or GIF, up to 5&nbsp;MB each.
      </p>
    </div>
  );
}