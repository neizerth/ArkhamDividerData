import type { IArkhamCards } from "@/types/arkhamCards";
import type { IDatabase } from "@/types/database";
import translations from "@/data/translations";

export const getStoryCustomContent = ({
  code,
  content
}: {
  code: string
  content: IArkhamCards.CustomContent
}): IDatabase.CustomContent => {
  const { creator } = content;
  
  const downloadLinks = Object.entries(content.download_link)
    .map(([language, link]) => {
      const langTranslation = translations[language];
      return (
        {
          language,
          links: [
            {
              link
            }
          ],
          translated_by: langTranslation?.translated_by[code]
        }
      )
    });

  return {
    creators: [
      {
        name: creator
      }
    ],
    download_links: downloadLinks,
  }
}