import { IArkhamCards } from "@/types/arkhamCards";
import { IDatabase } from "@/types/database";

export const getStoryCustomContent = (content?: IArkhamCards.CustomContent): IDatabase.CustomContent => {
  if (!content) {
    return;
  }
  const { creator } = content;
  const downloadLinks = Object.entries(content.download_link)
    .map(([language, link]) => (
      {
        language,
        links: [
          {
            link
          }
        ]
      }
    ))

  return {
    creators: [
      {
        name: creator
      }
    ],
    download_links: downloadLinks
  }
}