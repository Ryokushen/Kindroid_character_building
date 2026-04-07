"use client";

import type { CharacterSummary, LibraryDocument } from "@/lib/types";
import { useWorkbench } from "@/hooks/use-workbench";
import { Header } from "./header";
import { LibraryPanel } from "./library-panel";
import { DraftBuilderPanel } from "./draft-builder-panel";
import { CharacterPanel } from "./character-panel";

export function Workbench({
  initialDocuments,
  initialCharacters,
  recommendedDocuments,
}: {
  initialDocuments: LibraryDocument[];
  initialCharacters: CharacterSummary[];
  recommendedDocuments: string[];
}) {
  const { state, actions } = useWorkbench({
    initialDocuments,
    initialCharacters,
    recommendedDocuments,
  });

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:py-8">
      <Header message={state.message} error={state.error} isWorking={state.isWorking} onClearError={actions.clearError} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-start">
        <LibraryPanel
          documents={state.documents}
          selectedDocuments={state.selectedDocuments}
          activeDocument={state.activeDocument}
          activeDocumentRecord={state.activeDocumentRecord}
          isWorking={state.isWorking}
          onToggleSelect={actions.toggleDocumentSelection}
          onSetActive={(f) => actions.setActiveDocument(f)}
          onArchive={actions.handleArchiveDocument}
          onAddDocument={actions.handleAddDocument}
          onUpdateMetadata={actions.handleUpdateMetadata}
        />

        <DraftBuilderPanel state={state} actions={actions} />

        <CharacterPanel
          characters={state.characters}
          activeCharacter={state.activeCharacter}
          activeCharacterRecord={state.activeCharacterRecord}
          provider={state.provider}
          onSetActive={(f) => actions.setActiveCharacter(f)}
          onUpdateCharacter={actions.handleUpdateCharacter}
          onDeleteCharacter={actions.handleDeleteCharacter}
        />
      </div>
    </main>
  );
}
