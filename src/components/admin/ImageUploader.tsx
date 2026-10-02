import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, Loader2, AlertCircle, Check } from "lucide-react";
import { uploadToCloudinaryWithProgress } from "@/lib/cloudinary";

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  preset?: string;
}

export function ImageUploader({
  label = "Asset URL / Image",
  value,
  onChange,
  accept = "image/*,video/*",
  preset = "ishoots_preset",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccessMsg(false);

    try {
      const res = await uploadToCloudinaryWithProgress(file, (percent) => {
        setProgress(percent);
      }, preset);

      if (res.secure_url) {
        onChange(res.secure_url);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        throw new Error("No secure URL returned from server");
      }
    } catch (err: any) {
      console.warn("Cloudinary upload error:", err);
      setError(err.message || "Upload failed. Please check internet connection or enter asset URL.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs tracking-wider uppercase text-[#BE121D] font-bold">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Direct URL input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
            <LinkIcon size={14} />
          </div>
          <input
            type="text"
            disabled={uploading}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... (URL or asset path)"
            className="w-full rounded-xl border border-white/15 bg-[#222228] py-2.5 pl-9 pr-3 text-xs text-white placeholder-white/40 outline-none transition focus:border-[#99000D] disabled:opacity-50"
          />
        </div>

        {/* Cloudinary File Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#99000D]/40 bg-[#99000D]/15 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#99000D] disabled:opacity-50 shrink-0 shadow-sm"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin text-gold" /> {progress}%
            </>
          ) : (
            <>
              <Upload size={14} /> Upload Asset
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gold transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-white/50 text-right">Uploading {progress}%...</p>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-400">
          <Check size={14} /> Asset uploaded successfully!
        </p>
      )}

      {/* Error Notification */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Asset Preview Thumbnail */}
      {value && !uploading && (
        <div className="relative mt-2 h-20 w-32 overflow-hidden rounded-lg border border-white/10 bg-black">
          {value.match(/\.(mp4|webm|mov)$/i) || value.includes("video/upload") ? (
            <video src={value} className="h-full w-full object-cover" autoPlay muted loop />
          ) : (
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          )}
        </div>
      )}
    </div>
  );
}
