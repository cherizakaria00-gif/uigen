"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useRef } from "react";
import { Send, ImagePlus, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { AVAILABLE_MODELS } from "@/lib/provider";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  modelId?: string;
  onModelChange?: (id: string) => void;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  images = [],
  onImagesChange,
  modelId = "claude-haiku-4-5",
  onModelChange,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        onImagesChange?.([...images, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    onImagesChange?.(images.filter((_, i) => i !== index));
  };

  const currentModel = AVAILABLE_MODELS.find(m => m.id === modelId) ?? AVAILABLE_MODELS[0];

  return (
    <form onSubmit={handleSubmit} className="relative p-4 bg-white border-t border-neutral-200/60">
      <div className="relative max-w-4xl mx-auto">
        {images.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {images.map((src, i) => (
              <div key={i} className="relative group">
                <Image
                  src={src}
                  alt={`upload-${i}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg border border-neutral-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 bg-neutral-800 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the React component you want to create..."
          disabled={isLoading}
          className="w-full min-h-[80px] max-h-[200px] pl-4 pr-24 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 focus:bg-white transition-all placeholder:text-neutral-400 text-[15px] font-normal shadow-sm"
          rows={3}
        />

        {/* Bottom bar: model selector + actions */}
        <div className="flex items-center justify-between mt-2 px-1">
          {/* Model selector */}
          <div className="relative">
            <select
              value={modelId}
              onChange={(e) => onModelChange?.(e.target.value)}
              disabled={isLoading}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-neutral-200 bg-white text-[12px] text-neutral-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer disabled:opacity-40 hover:border-neutral-300 transition-colors"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} — {m.description}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400 pointer-events-none" />
          </div>

          {/* Image + Send */}
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg transition-all hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <ImagePlus className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !input?.trim()}
              className="p-2 rounded-lg transition-all hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group"
            >
              <Send className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLoading || !input?.trim() ? 'text-neutral-300' : 'text-blue-600'}`} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
