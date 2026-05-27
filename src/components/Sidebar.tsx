"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Search,
  MessageSquare,
  FolderOpen,
  Sparkles,
  Palette,
  Code2,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { signOut } from "@/actions";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface SidebarProps {
  user?: { id: string; email: string } | null;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  updatedAt: Date;
}

export function Sidebar({ user, projectId }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getProjects().then(setProjects).catch(console.error);
    }
  }, [user, projectId]);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNew = async () => {
    const project = await createProject({
      name: `Design #${~~(Math.random() * 100000)}`,
      messages: [],
      data: {},
    });
    router.push(`/${project.id}`);
  };

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="h-full w-64 flex flex-col bg-[#f5f4ef] border-r border-neutral-200/60 select-none">
      {/* Top nav */}
      <div className="flex flex-col gap-0.5 px-3 pt-4 pb-2">
        <button
          onClick={handleNew}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-800 hover:bg-neutral-200/60 transition-colors text-[14px] font-medium"
        >
          <Plus className="h-4 w-4 text-neutral-500" />
          Nouvelle conversation
        </button>

        <button
          onClick={() => setShowSearch((v) => !v)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-200/60 transition-colors text-[14px]"
        >
          <Search className="h-4 w-4 text-neutral-500" />
          Rechercher
        </button>

        {showSearch && (
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="mx-3 mt-1 mb-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        )}

        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-200/60 transition-colors text-[14px]">
          <MessageSquare className="h-4 w-4 text-neutral-500" />
          Discussions
        </button>

        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-200/60 transition-colors text-[14px]">
          <FolderOpen className="h-4 w-4 text-neutral-500" />
          Projets
        </button>

        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-200/60 transition-colors text-[14px]">
          <Sparkles className="h-4 w-4 text-neutral-500" />
          Artéfacts
        </button>
      </div>

      {/* Products section */}
      <div className="px-3 pt-3 pb-1">
        <p className="px-3 text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-1">
          Produits
        </p>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-200/60 transition-colors text-[14px] w-full">
          <Code2 className="h-4 w-4 text-neutral-500" />
          Code
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-200/60 transition-colors text-[14px] w-full">
          <Palette className="h-4 w-4 text-neutral-500" />
          Design
        </button>
      </div>

      {/* Recent projects */}
      <div className="flex-1 overflow-y-auto px-3 pt-3">
        <p className="px-3 text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-1">
          Récents
        </p>
        <div className="flex flex-col gap-0.5">
          {filtered.map((project) => (
            <button
              key={project.id}
              onClick={() => router.push(`/${project.id}`)}
              className={`flex items-center px-3 py-2 rounded-lg text-[13px] text-left truncate transition-colors w-full ${
                project.id === projectId
                  ? "bg-neutral-200/80 text-neutral-900 font-medium"
                  : "text-neutral-700 hover:bg-neutral-200/50"
              }`}
            >
              <span className="truncate">{project.name}</span>
            </button>
          ))}
          {!user && (
            <p className="px-3 py-2 text-[13px] text-neutral-400 italic">
              Connectez-vous pour voir vos projets
            </p>
          )}
        </div>
      </div>

      {/* User footer */}
      <div className="px-3 pb-4 pt-2 border-t border-neutral-200/60 mt-2">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-neutral-200/60 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
                {initials}
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-[13px] font-medium text-neutral-800 truncate w-full">
                  {user.email.split("@")[0]}
                </span>
                <span className="text-[11px] text-neutral-400">Forfait Pro</span>
              </div>
              <ChevronUp className={`h-4 w-4 text-neutral-400 transition-transform ${userMenuOpen ? "" : "rotate-180"}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden py-1">
                <button
                  onClick={async () => { setUserMenuOpen(false); await signOut(); }}
                  className="flex items-center gap-3 px-4 py-2 w-full text-[13px] text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-neutral-400" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-2">
            <button
              onClick={() => { setAuthMode("signin"); setAuthDialogOpen(true); }}
              className="w-full py-2 rounded-lg border border-neutral-300 text-[13px] text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={() => { setAuthMode("signup"); setAuthDialogOpen(true); }}
              className="w-full py-2 rounded-lg bg-neutral-900 text-white text-[13px] hover:bg-neutral-800 transition-colors"
            >
              S'inscrire
            </button>
          </div>
        )}
      </div>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode={authMode}
      />
    </div>
  );
}
