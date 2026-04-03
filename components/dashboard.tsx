"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";

import type { CharacterSummary, LibraryDocument, ProviderSettings } from "@/lib/types";

type DashboardProps = {
  initialDocuments: LibraryDocument[];
  initialCharacters: CharacterSummary[];
  recommendedDocuments: string[];
};

const LOCAL_STORAGE_KEY = "kindroid-workbench-provider";

const defaultProviderSettings: ProviderSettings = {
  providerLabel: "OpenAI-compatible",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4.1-mini",
  apiKey: "",
  temperature: 0.8,
};

export function Dashboard({
  initialDocuments,
  initialCharacters,
  recommendedDocuments,
}: DashboardProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [characters, setCharacters] = useState(initialCharacters);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>(recommendedDocuments);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [activeDocument, setActiveDocument] = useState<string>(initialDocuments[0]?.fileName ?? "");
  const [activeCharacter, setActiveCharacter] = useState<string>(initialCharacters[0]?.fileName ?? "");
  const [provider, setProvider] = useState<ProviderSettings>(defaultProviderSettings);
  const [brief, setBrief] = useState("");
  const [notes, setNotes] = useState("");
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [newDocumentContent, setNewDocumentContent] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
  const [message, setMessage] = useState("Select source docs, add your prompt, then generate a draft.");
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<ProviderSettings>;
      setProvider((current) => ({
        ...current,
        ...parsed,
        apiKey: parsed.apiKey ?? "",
      }));
    } catch {
      // Ignore invalid local settings.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(provider));
  }, [provider]);

  const activeDocumentRecord = useMemo(
    () => documents.find((document) => document.fileName === activeDocument),
    [activeDocument, documents],
  );

  const activeCharacterRecord = useMemo(
    () => characters.find((character) => character.fileName === activeCharacter),
    [activeCharacter, characters],
  );

  function toggleSelection(
    target: string,
    collection: string[],
    setter: Dispatch<SetStateAction<string[]>>,
  ) {
    const next = collection.includes(target)
      ? collection.filter((item) => item !== target)
      : [...collection, target];
    setter(next);
  }

  function refreshFromPayload(payload: {
    documents?: LibraryDocument[];
    characters?: CharacterSummary[];
    message?: string;
  }) {
    if (payload.documents) {
      setDocuments(payload.documents);
      setActiveDocument((current) => current || payload.documents?.[0]?.fileName || "");
    }

    if (payload.characters) {
      setCharacters(payload.characters);
      setActiveCharacter((current) => current || payload.characters?.[0]?.fileName || "");
    }

    if (payload.message) {
      setMessage(payload.message);
    }
  }

  function handleAddDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Adding repository document...");
    setIsWorking(true);

    void (async () => {
      try {
        const formData = new FormData();
        formData.set("title", newDocumentTitle);
        formData.set("content", newDocumentContent);
        if (newDocumentFile) {
          formData.set("file", newDocumentFile);
        }

        const response = await fetch("/api/library", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json()) as {
          document?: LibraryDocument;
          documents?: LibraryDocument[];
          message?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to add document.");
        }

        refreshFromPayload(payload);
        if (payload.document) {
          const newDocument = payload.document;
          setSelectedDocuments((current) =>
            current.includes(newDocument.fileName)
              ? current
              : [...current, newDocument.fileName],
          );
          setActiveDocument(newDocument.fileName);
        }
        setNewDocumentTitle("");
        setNewDocumentContent("");
        setNewDocumentFile(null);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to add document.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleArchiveDocument(fileName: string) {
    setMessage(`Archiving ${fileName}...`);
    setIsWorking(true);

    void (async () => {
      try {
        const response = await fetch("/api/library/archive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName }),
        });
        const payload = (await response.json()) as {
          documents?: LibraryDocument[];
          message?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to archive document.");
        }

        setSelectedDocuments((current) => current.filter((item) => item !== fileName));
        if (activeDocument === fileName) {
          setActiveDocument(payload.documents?.[0]?.fileName ?? "");
        }
        refreshFromPayload(payload);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to archive document.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleGenerate() {
    setMessage("Generating character draft...");
    setIsWorking(true);

    void (async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brief,
            notes,
            selectedDocuments,
            selectedCharacters,
            provider,
          }),
        });

        const payload = (await response.json()) as {
          markdown?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to generate draft.");
        }

        setGeneratedMarkdown(payload.markdown || "");
        setMessage("Draft ready. Review the markdown, then save it into the local character library.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to generate draft.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  function handleSaveCharacter() {
    setMessage("Saving generated draft into the character library...");
    setIsWorking(true);

    void (async () => {
      try {
        const response = await fetch("/api/characters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ markdown: generatedMarkdown }),
        });

        const payload = (await response.json()) as {
          character?: CharacterSummary;
          characters?: CharacterSummary[];
          message?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to save character.");
        }

        refreshFromPayload(payload);
        if (payload.character) {
          setActiveCharacter(payload.character.fileName);
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to save character.");
      } finally {
        setIsWorking(false);
      }
    })();
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Local-first character tooling</p>
          <h1>Kindroid Character Workbench</h1>
          <p className="hero-copy">
            Manage your best-practice repository, inspect existing characters, and generate
            structured character drafts against the source material already in this repo.
          </p>
        </div>
        <div className="status-card">
          <span className={`status-dot${isWorking ? " is-busy" : ""}`} />
          <p>{message}</p>
        </div>
      </section>

      <section className="workspace-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Repository</p>
              <h2>Knowledge Library</h2>
            </div>
            <span className="pill">{documents.length} docs</span>
          </div>

          <form className="stack" onSubmit={handleAddDocument}>
            <label className="field">
              <span>Add note title</span>
              <input
                type="text"
                value={newDocumentTitle}
                onChange={(event) => setNewDocumentTitle(event.target.value)}
                placeholder="Example: Tone guardrails"
              />
            </label>

            <label className="field">
              <span>Paste repository content</span>
              <textarea
                rows={5}
                value={newDocumentContent}
                onChange={(event) => setNewDocumentContent(event.target.value)}
                placeholder="Paste new guidance or extracted notes here..."
              />
            </label>

            <label className="field">
              <span>Or upload .txt / .md</span>
              <input
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={(event) => setNewDocumentFile(event.target.files?.[0] ?? null)}
              />
            </label>

            <button className="primary-button" type="submit" disabled={isWorking}>
              Add document
            </button>
          </form>

          <div className="list">
            {documents.map((document) => {
              const isSelected = selectedDocuments.includes(document.fileName);
              const isActive = activeDocument === document.fileName;

              return (
                <div
                  key={document.fileName}
                  className={`list-item${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveDocument(document.fileName)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveDocument(document.fileName);
                    }
                  }}
                >
                  <div className="list-item-top">
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          toggleSelection(document.fileName, selectedDocuments, setSelectedDocuments)
                        }
                        onClick={(event) => event.stopPropagation()}
                      />
                      <span>{document.displayName}</span>
                    </label>
                    <button
                      className="ghost-button"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleArchiveDocument(document.fileName);
                      }}
                      disabled={isWorking}
                    >
                      Archive
                    </button>
                  </div>
                  <p>{document.preview}</p>
                </div>
              );
            })}
          </div>

          <div className="preview">
            <div className="preview-heading">
              <h3>Selected document preview</h3>
              <span>{activeDocumentRecord?.fileName ?? "No document selected"}</span>
            </div>
            <pre>{activeDocumentRecord?.content ?? "Pick a document to inspect its contents."}</pre>
          </div>
        </article>

        <article className="panel panel-accent">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Generation</p>
              <h2>Draft Builder</h2>
            </div>
            <span className="pill">{selectedDocuments.length} docs in context</span>
          </div>

          <div className="stack">
            <div className="field-grid">
              <label className="field">
                <span>Provider label</span>
                <input
                  type="text"
                  value={provider.providerLabel}
                  onChange={(event) =>
                    setProvider((current) => ({ ...current, providerLabel: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Model</span>
                <input
                  type="text"
                  value={provider.model}
                  onChange={(event) =>
                    setProvider((current) => ({ ...current, model: event.target.value }))
                  }
                  placeholder="gpt-4.1-mini"
                />
              </label>
            </div>

            <label className="field">
              <span>OpenAI-compatible base URL</span>
              <input
                type="text"
                value={provider.baseUrl}
                onChange={(event) =>
                  setProvider((current) => ({ ...current, baseUrl: event.target.value }))
                }
                placeholder="https://api.openai.com/v1"
              />
            </label>

            <label className="field">
              <span>API key</span>
              <input
                type="password"
                value={provider.apiKey}
                onChange={(event) =>
                  setProvider((current) => ({ ...current, apiKey: event.target.value }))
                }
                placeholder="Stored only in this browser's localStorage"
              />
            </label>

            <label className="field">
              <span>Temperature</span>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={provider.temperature}
                onChange={(event) =>
                  setProvider((current) => ({
                    ...current,
                    temperature: Number(event.target.value) || 0,
                  }))
                }
              />
            </label>

            <label className="field">
              <span>Character brief</span>
              <textarea
                rows={7}
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                placeholder="Describe the character concept, role, tone, relationship dynamic, setting, and any required sections."
              />
            </label>

            <label className="field">
              <span>Additional notes</span>
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional guardrails, formatting requests, or constraints."
              />
            </label>

            <div className="selection-block">
              <div className="preview-heading">
                <h3>Reference characters</h3>
                <span>{selectedCharacters.length} selected</span>
              </div>
              <div className="chip-grid">
                {characters.map((character) => {
                  const checked = selectedCharacters.includes(character.fileName);
                  return (
                    <label className={`chip${checked ? " is-checked" : ""}`} key={character.fileName}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleSelection(
                            character.fileName,
                            selectedCharacters,
                            setSelectedCharacters,
                          )
                        }
                      />
                      <span>{character.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button className="primary-button" type="button" onClick={handleGenerate} disabled={isWorking}>
              Generate draft
            </button>
          </div>

          <div className="preview">
            <div className="preview-heading">
              <h3>Generated markdown</h3>
              <button
                className="primary-button"
                type="button"
                onClick={handleSaveCharacter}
                disabled={isWorking || !generatedMarkdown.trim()}
              >
                Save to characters
              </button>
            </div>
            <textarea
              className="editor"
              value={generatedMarkdown}
              onChange={(event) => setGeneratedMarkdown(event.target.value)}
              placeholder="Generated character markdown will appear here."
            />
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Library</p>
              <h2>Character Files</h2>
            </div>
            <span className="pill">{characters.length} characters</span>
          </div>

          <div className="list">
            {characters.map((character) => {
              const isActive = activeCharacter === character.fileName;

              return (
                <div
                  key={character.fileName}
                  className={`list-item${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveCharacter(character.fileName)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveCharacter(character.fileName);
                    }
                  }}
                >
                  <div className="list-item-top">
                    <strong>{character.title}</strong>
                    <span>{new Date(character.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <p>{character.preview}</p>
                </div>
              );
            })}
          </div>

          <div className="preview">
            <div className="preview-heading">
              <h3>Character preview</h3>
              <span>{activeCharacterRecord?.fileName ?? "No character selected"}</span>
            </div>
            <pre>{activeCharacterRecord?.content ?? "Pick a character file to inspect it."}</pre>
          </div>
        </article>
      </section>
    </main>
  );
}
