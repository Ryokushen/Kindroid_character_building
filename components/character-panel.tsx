"use client";

import type { CharacterSummary, ProviderSettings } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CharacterList } from "./character-list";
import { CharacterPreview } from "./character-preview";
import { KindroidReadyView } from "./kindroid-ready-view";
import { CharacterEditor } from "./character-editor";

export function CharacterPanel({
  characters,
  activeCharacter,
  activeCharacterRecord,
  provider,
  onSetActive,
  onUpdateCharacter,
}: {
  characters: CharacterSummary[];
  activeCharacter: string;
  activeCharacterRecord: CharacterSummary | undefined;
  provider: ProviderSettings;
  onSetActive: (fileName: string) => void;
  onUpdateCharacter: (fileName: string, markdown: string) => void;
}) {
  return (
    <Card className="border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
              Library
            </p>
            <CardTitle className="font-heading text-lg">Character Files</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            {characters.length} characters
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CharacterList
          characters={characters}
          activeCharacter={activeCharacter}
          onSetActive={onSetActive}
        />

        <Separator className="bg-border/60" />

        {activeCharacterRecord ? (
          <Tabs defaultValue="kindroid" className="w-full">
            <TabsList className="mb-2 bg-muted/50">
              <TabsTrigger value="kindroid" className="text-xs">
                Kindroid Transfer
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-xs">
                Edit
              </TabsTrigger>
              <TabsTrigger value="raw" className="text-xs">
                Raw Markdown
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kindroid">
              <KindroidReadyView character={activeCharacterRecord} />
            </TabsContent>

            <TabsContent value="edit">
              <CharacterEditor
                character={activeCharacterRecord}
                provider={provider}
                onSave={(markdown) => onUpdateCharacter(activeCharacterRecord.fileName, markdown)}
              />
            </TabsContent>

            <TabsContent value="raw">
              <CharacterPreview character={activeCharacterRecord} />
            </TabsContent>
          </Tabs>
        ) : (
          <CharacterPreview character={undefined} />
        )}
      </CardContent>
    </Card>
  );
}
