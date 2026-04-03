import { Dashboard } from "@/components/dashboard";
import { listCharacters } from "@/lib/characters";
import { getRecommendedDocumentNames, listLibraryDocuments } from "@/lib/library";

export default async function HomePage() {
  const [documents, characters] = await Promise.all([listLibraryDocuments(), listCharacters()]);
  const recommendedDocuments = getRecommendedDocumentNames(documents);

  return (
    <Dashboard
      initialDocuments={documents}
      initialCharacters={characters}
      recommendedDocuments={recommendedDocuments}
    />
  );
}
