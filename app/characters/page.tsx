import { CharacterLibrary } from "@/components/character-library";
import { listCharacters } from "@/lib/characters";

export default async function CharactersPage() {
  const characters = await listCharacters();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:py-8">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Character Library
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Saved Characters
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Browse, edit, and copy-paste character fields into Kindroid.
            </p>
          </div>
          <a
            href="/"
            className="rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Back to Workbench
          </a>
        </div>
      </header>

      <CharacterLibrary initialCharacters={characters} />
    </main>
  );
}
