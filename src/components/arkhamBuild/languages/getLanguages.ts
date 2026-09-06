import {
	ARKHAM_BUILD_LANGUAGES,
	resolveArkhamBuildLanguage,
} from "@/api/arkhamBuild/constants";

export const getLanguages = (): string[] => [...ARKHAM_BUILD_LANGUAGES];

export const supportsLanguage = (language: string): boolean =>
	resolveArkhamBuildLanguage(language) !== null;
