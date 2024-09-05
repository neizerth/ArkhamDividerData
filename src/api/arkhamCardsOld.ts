export const ARKHAM_CARDS_URL = process.env.ARKHAM_CARDS_URL;
export const ARKHAM_CARDS_CONTENTS_URL = process.env.ARKHAM_CARDS_CONTENTS_URL;

export const ARKHAM_CARDS_ICOMOON_PATH = '/assets/icomoon/project.json';
export const ARKHAM_CARDS_GENERATED_PATH = '/assets/generated';
export const ARKHAM_CARDS_I18N_PATH = '/assets/i18n';

export const fetchArkhamCardsContents = (path: string) => fetch(ARKHAM_CARDS_CONTENTS_URL + path);
export const fetchArkhamCardsAsset = (path: string) => fetch(ARKHAM_CARDS_URL + path);

export const fetchIcomoonProject = () => toJSON(fetchArkhamCardsAsset(ARKHAM_CARDS_ICOMOON_PATH));

export const fetchIconPatch = () => toText(
  fetchArkhamCardsAsset('/src/icons/EncounterIcon.tsx')
);

export const fetchGeneratedContents = () => fetchArkhamCardsContents('/assets/generated');

export const withLanguagePostfix = (getUrl: (language: string) => string) => (language: string) => {
    const postfix = language === 'en' ? '' : '_' + language;
    const url = getUrl(postfix);

    return toJSON(
      fetchArkhamCardsAsset(url)
    );
}

export const fetchScenarioNames = withLanguagePostfix(
  (language: string) => `${ARKHAM_CARDS_GENERATED_PATH}/scenarioNames${language}.json`
);

export const fetchCampaigns = withLanguagePostfix(
  (language: string) => `${ARKHAM_CARDS_GENERATED_PATH}/allCampaigns${language}.json`
);

export const fetchEncounterSets = withLanguagePostfix(
  (language: string) => `${ARKHAM_CARDS_GENERATED_PATH}/encounterSets${language}.json`
);

export const fetchCoreTranslations = (language: string) => 
    fetchArkhamCardsAsset(
        ARKHAM_CARDS_I18N_PATH + `/${language}.po.json`
    );
