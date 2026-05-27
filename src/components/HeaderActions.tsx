"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useFileSystem } from "@/lib/contexts/file-system-context";

interface HeaderActionsProps {
  user?: { id: string; email: string } | null;
  projectId?: string;
}

function DownloadZipButton() {
  const { getAllFiles } = useFileSystem();

  const handleDownload = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const files = getAllFiles();
    files.forEach((content, path) => {
      zip.file(path.replace(/^\//, ""), content);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" className="h-8 gap-2" onClick={handleDownload} title="Download as ZIP">
      <Download className="h-4 w-4" />
      Download
    </Button>
  );
}

export function HeaderActions(_props: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <DownloadZipButton />
    </div>
  );
}
