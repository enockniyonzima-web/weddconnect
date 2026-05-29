"use client";

import { useState } from "react";
import { Play, X, ExternalLink, AlertCircle } from "lucide-react";

interface VideoPreviewProps {
  url: string;
  onDelete?: (url: string) => void;
}

const getEmbedUrl = (url: string): string | null => {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
};

const isValidUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export const VideoPreview: React.FC<VideoPreviewProps> = ({ url, onDelete }) => {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(url);
  const valid = isValidUrl(url);

  if (!valid) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/5">
        <AlertCircle size={15} className="text-red-400 shrink-0" />
        <span className="flex-1 text-xs text-red-400 truncate">Invalid URL: {url}</span>
        {onDelete && (
          <button type="button" onClick={() => onDelete(url)} className="shrink-0 text-red-500 hover:text-red-300 transition-colors">
            <X size={13} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl border border-gray-800 bg-gray-900 overflow-hidden group">
      {playing && embedUrl ? (
        <div className="relative w-full aspect-video">
          <iframe
            src={embedUrl + "?autoplay=1"}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full"
            title="video preview"
          />
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="absolute top-2 right-2 flex items-center justify-center h-7 w-7 rounded-lg bg-black/70 border border-gray-700 text-gray-300 hover:text-white z-10"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => embedUrl ? setPlaying(true) : window.open(url, "_blank")}
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 transition-colors"
          >
            <Play size={14} fill="currentColor" />
          </button>
          {embedUrl && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-gray-600 hover:text-gray-400">
              <ExternalLink size={13} />
            </a>
          )}
          {onDelete && (
            <button type="button" onClick={() => onDelete(url)} className="shrink-0 text-gray-600 hover:text-red-400 transition-colors">
              <X size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
