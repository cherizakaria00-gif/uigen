"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Download, FolderOpen, ChevronDown, LogOut } from "lucide-react";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import { signOut } from "@/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface HeaderActionsProps {
  user?: { id: string; email: string } | null;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download ZIP">
      <Download className="h-4 w-4" />
    </Button>
  );
}

export function HeaderActions({ user, projectId }: HeaderActionsProps) {
  const router = useRouter();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getProjects()
        .then(setProjects)
        .catch(console.error)
        .finally(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [user, projectId]);

  useEffect(() => {
    if (user && projectsOpen) {
      getProjects().then(setProjects).catch(console.error);
    }
  }, [projectsOpen, user]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProject = projects.find((p) => p.id === projectId);

  const handleNewDesign = async () => {
    const project = await createProject({
      name: `Design #${~~(Math.random() * 100000)}`,
      messages: [],
      data: {},
    });
    router.push(`/${project.id}`);
  };

  return (
    <div className="flex items-center gap-2">
      {!initialLoading && user && (
        <Popover open={projectsOpen} onOpenChange={setProjectsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 gap-2 max-w-[180px]" role="combobox">
              <FolderOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {currentProject ? currentProject.name : "Select Project"}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="end">
            <Command>
              <CommandInput
                placeholder="Search projects..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup>
                  {filteredProjects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.name}
                      onSelect={() => {
                        router.push(`/${project.id}`);
                        setProjectsOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="font-medium">{project.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {user && (
        <Button className="h-8 gap-2" onClick={handleNewDesign}>
          <Plus className="h-4 w-4" />
          New Design
        </Button>
      )}

      <DownloadZipButton />

      {user && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={async () => await signOut()}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
