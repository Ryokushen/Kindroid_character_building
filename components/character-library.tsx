"use client";

import { useEffect, useState } from "react";
import type { CharacterSummary, ProviderSettings } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { KindroidReadyView } from "./kindroid-ready-view";
import { CharacterPreview } from "./character-preview";
import { CharacterEditor } from "./character-editor";
import { CharacterRedesigner } from "./character-redesigner";
import { ProviderSettings as ProviderSettingsPanel } from "./provider-settings";

const LOCAL_STORAGE_KEY = "kindroid-workbench-provider";
const API_KEYS_STORAGE_KEY = "kindroid-workbench-api-keys";

const defaultProvider: ProviderSettings = {
  providerType: "openai",
  providerLabel: "OpenAI",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4.1-mini",
  apiKey: "",
  temperature: 0.8,
};

export function CharacterLibrary({
  initialCharacters,
}: {
  initialCharacters: CharacterSummary[];
}) {
  const [characters, setCharacters] = useState(initialCharacters);
  const [activeCharacter, setActiveCharacter] = useState(initialCharacters[0]?.fileName ?? "");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [provider, setProvider] = useState<ProviderSettings>(defaultProvider);
  const [statusMessage, setStatusMessage] = useState("");

  // Load provider settings from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ProviderSettings>;
        const keysRaw = window.localStorage.getItem(API_KEYS_STORAGE_KEY);
        const savedKeys = keysRaw ? (JSON.parse(keysRaw) as Record<string, string>) : {};
        const providerType = parsed.providerType ?? "openai";
        setProvider((c) => ({
          ...c,
          ...parsed,
          apiKey: savedKeys[providerType] ?? parsed.apiKey ?? "",
        }));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Persist provider settings
  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(provider));
    if (provider.apiKey) {
      try {
        const keysRaw = window.localStorage.getItem(API_KEYS_STORAGE_KEY);
        const savedKeys = keysRaw ? (JSON.parse(keysRaw) as Record<string, string>) : {};
        savedKeys[provider.providerType] = provider.apiKey;
        window.localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(savedKeys));
      } catch {
        // Ignore
      }
    }
  }, [provider]);

  const activeRecord = characters.find((c) => c.fileName === activeCharacter);

  async function handleDelete(fileName: string) {
    try {
      const response = await fetch("/api/characters", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });
      if (response.ok) {
        const payload = (await response.json()) as { characters?: CharacterSummary[] };
        if (payload.characters) {
          setCharacters(payload.characters);
          if (activeCharacter === fileName) {
            setActiveCharacter(payload.characters[0]?.fileName ?? "");
          }
        }
        setStatusMessage("Character archived.");
        setTimeout(() => setStatusMessage(""), 3000);
      }
    } catch {
      // Silent fail
    }
  }

  async function handleUpdateCharacter(fileName: string, markdown: string) {
    try {
      const response = await fetch("/api/characters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, markdown }),
      });
      if (response.ok) {
        const payload = (await response.json()) as {
          character?: CharacterSummary;
          characters?: CharacterSummary[];
          message?: string;
        };
        if (payload.characters) {
          setCharacters(payload.characters);
        }
        setStatusMessage(payload.message || "Character saved.");
        setTimeout(() => setStatusMessage(""), 3000);
      }
    } catch {
      setStatusMessage("Failed to save character.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }

  return (
    <div className="space-y-4">
      {/* Provider settings + status */}
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <ProviderSettingsPanel provider={provider} setProvider={setProvider} />
        </div>
        {statusMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400">{statusMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* Character list sidebar */}
        <Card className="border-border bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-base">Characters</CardTitle>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                {characters.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-320px)] pr-2">
              <div className="space-y-2">
                {characters.map((char) => {
                  const isActive = activeCharacter === char.fileName;
                  const isConfirming = confirmDelete === char.fileName;

                  return (
                    <div
                      key={char.fileName}
                      className={cn(
                        "cursor-pointer rounded-lg border border-border bg-muted/30 p-3 transition-all hover:border-accent/30 hover:bg-muted/50",
                        isActive && "border-accent/40 bg-accent/5 shadow-[0_0_12px_oklch(0.55_0.2_295_/_0.1)]",
                      )}
                      onClick={() => setActiveCharacter(char.fileName)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveCharacter(char.fileName);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-foreground">{char.title}</strong>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(char.updatedAt).toLocaleDateString()}
                          </span>
                          {isConfirming ? (
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleDelete(char.fileName);
                                  setConfirmDelete(null);
                                }}
                                className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(null)}
                                className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted/50 text-muted-foreground hover:bg-muted/70 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(char.fileName);
                              }}
                              className="rounded p-0.5 text-muted-foreground/40 hover:text-red-400 transition-colors"
                              title="Delete character"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {char.preview}
                      </p>
                    </div>
                  );
                })}
                {characters.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No characters saved yet. Generate one from the workbench.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Character detail view */}
        <Card className="border-border bg-card/60 backdrop-blur-md">
          <CardContent className="pt-6">
            {activeRecord ? (
              <Tabs defaultValue="kindroid" className="w-full">
                <TabsList className="mb-4 bg-muted/50">
                  <TabsTrigger value="kindroid" className="text-xs">
                    Kindroid Transfer
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="text-xs">
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="redesign" className="text-xs">
                    Redesign
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="text-xs">
                    Raw Markdown
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="kindroid">
                  <KindroidReadyView character={activeRecord} />
                </TabsContent>

                <TabsContent value="edit">
                  <CharacterEditor
                    character={activeRecord}
                    provider={provider}
                    onSave={(markdown) => handleUpdateCharacter(activeRecord.fileName, markdown)}
                  />
                </TabsContent>

                <TabsContent value="redesign">
                  <CharacterRedesigner
                    character={activeRecord}
                    provider={provider}
                    onSave={(markdown) => handleUpdateCharacter(activeRecord.fileName, markdown)}
                  />
                </TabsContent>

                <TabsContent value="raw">
                  <CharacterPreview character={activeRecord} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                Select a character to view, edit, or copy-paste their Kindroid fields.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
