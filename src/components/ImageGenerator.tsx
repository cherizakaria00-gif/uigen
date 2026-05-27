"use client";

import { useState } from "react";
import { Wand2, Download, Loader2, X, ImageIcon } from "lucide-react";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setImages((prev) => [...data.urls, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, index: number) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `generated-${index + 1}.webp`;
    a.click();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-200/60 transition-colors text-[14px] w-full"
      >
        <ImageIcon className="h-4 w-4 text-neutral-500" />
        Générer une image
      </button>
    );
  }

  return (
    <div className="mx-2 mb-2 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-purple-500" />
          <span className="text-[13px] font-medium text-neutral-800">
            FLUX Image Generator
          </span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-0.5 rounded hover:bg-neutral-100 transition-colors"
        >
          <X className="h-3.5 w-3.5 text-neutral-400" />
        </button>
      </div>

      {/* Input */}
      <div className="p-3 flex flex-col gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="Describe l'image à générer..."
          rows={3}
          className="w-full px-3 py-2 text-[13px] rounded-lg border border-neutral-200 bg-neutral-50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 placeholder:text-neutral-400"
        />

        {error && (
          <p className="text-[12px] text-red-500 px-1">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-medium transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Générer
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {images.length > 0 && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-neutral-200">
              <img src={url} alt={`generated-${i}`} className="w-full object-cover" />
              <button
                onClick={() => handleDownload(url, i)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                title="Télécharger"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
