import { Workbench } from "@/components/workbench";
import { listCharacters } from "@/lib/characters";
import { getRecommendedDocumentNames, listLibraryDocuments } from "@/lib/library";

export default async function HomePage() {
  const [documents, characters] = await Promise.all([listLibraryDocuments(), listCharacters()]);
  const recommendedDocuments = getRecommendedDocumentNames(documents);

  return (
    <Workbench
      initialDocuments={documents}
      initialCharacters={characters}
      recommendedDocuments={recommendedDocuments}
    />
  );
}
