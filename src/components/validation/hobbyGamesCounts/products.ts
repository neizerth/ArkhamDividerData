import type { HobbyGamesCampaignProduct } from "./types";

/**
 * Official products on hobbygames.ru with scenario/encounter card totals
 * in the product description.
 */
export const HOBBY_GAMES_CAMPAIGN_PRODUCTS: HobbyGamesCampaignProduct[] = [
	{
		story_code: "core_2026",
		slug: "uzhas-arkhjema-kartochnaja-igra-vtoroj-sezon",
		label: "Второй сезон",
	},
	{
		story_code: "dwl",
		slug: "uzhas-arkhjema-kartochnaja-igra-nasledie-danvicha-kampanija",
		label: "Наследие Данвича. Кампания",
	},
	{
		story_code: "ptc",
		slug: "uzhas-arkhjema-kartochnaja-igra-put-v-karkozu-kampanija",
		label: "Путь в Каркозу. Кампания",
	},
	{
		story_code: "tfa",
		slug: "uzhas-arkhjema-kartochnaja-igra-zabitaja-jepoha-kampanija",
		label: "Забытая эпоха. Кампания",
	},
	{
		story_code: "tcu",
		slug: "uzhas-arkhjema-kartochnaja-igra-narushennij-krug-kampanija",
		label: "Нарушенный круг. Кампания",
	},
	{
		story_code: "tde",
		slug: "uzhas-arkhjema-kartochnaja-igra-pozhirateli-snov-kampanija",
		label: "Пожиратели снов. Кампания",
	},
	{
		story_code: "tic",
		slug: "uzhas-arkhjema-kartochnaja-igra-zagovor-v-insmute-kampanija",
		label: "Заговор в Инсмуте. Кампания",
	},
	{
		story_code: "eoe",
		slug: "uzhas-arkhjema-kartochnaja-igra-na-kraju-zemli-kampanija",
		label: "На краю земли. Кампания",
	},
	{
		story_code: "tsk",
		slug: "uzhas-arkhjema-kartochnaja-igra-alie-kljuchi-kampanija",
		label: "Алые ключи. Кампания",
	},
	{
		story_code: "fhv",
		slug: "uzhas-arkhjema-kartochnaja-igra-pir-v-hemlok-vejl-kampanija",
		label: "Пир в Хемлок-Вейл. Кампания",
	},
	{
		story_code: "tdc",
		slug: "uzhas-arkhjema-kartochnaja-igra-zatonuvshij-gorod-kampanija",
		label: "Затонувший город. Кампания",
	},
];

/**
 * Official standalone / side-story scenario packs sold separately.
 * Curse of the Rougarou omitted: Hobby/FFG list 62 cards (incl. setup/reference)
 * while ArkhamDB only has the 57 encounter cards — no fake size bonus.
 */
export const HOBBY_GAMES_STANDALONE_PRODUCTS: HobbyGamesCampaignProduct[] = [
	{
		story_code: "coh",
		slug: "uzhas-arkhjema-kartochnaja-igra-karnaval-uzhasov",
		label: "Карнавал ужасов",
	},
	{
		story_code: "lol",
		slug: "uzhas-arkhjema-kartochnaja-igra-labirinti-bezumija",
		label: "Лабиринты безумия",
	},
	{
		story_code: "guardians",
		slug: "uzhas-arkhjema-kartochnaja-igra-strazhi-bezdni",
		label: "Стражи бездны",
	},
	{
		story_code: "blob",
		slug: "uzhas-arkhjema-kartochnaja-igra-kaplja-poglotivshaja-vsjo",
		label: "Капля, поглотившая всё",
	},
	{
		story_code: "hotel",
		slug: "uzhas-arkhjema-kartochnaja-igra-ubijstvo-v-otele-jekselsior",
		label: "Убийство в отеле «Эксельсиор»",
	},
	{
		story_code: "wog",
		slug: "uzhas-arkhjema-kartochnaja-igra-vojna-vneshnih-bogov",
		label: "Война Внешних богов",
	},
	{
		story_code: "mtt",
		slug: "uzhas-arkhjema-kartochnaja-igra-mahinacii-skvoz-vremja",
		label: "Махинации сквозь время",
	},
	{
		story_code: "fof",
		slug: "uzhas-arkhjema-kartochnaja-igra-fortuna-i-bezrassudstvo",
		label: "Фортуна и безрассудство",
	},
	{
		story_code: "film_fatale",
		slug: "uzhas-arkhjema-kartochnaja-igra-rokovie-sjomki",
		label: "Роковые съёмки",
	},
	{
		story_code: "tmg",
		slug: "uzhas-arkhjema-kartochnaja-igra-jolskij-bal",
		label: "Йольский бал",
	},
];

export const HOBBY_GAMES_PRODUCTS: HobbyGamesCampaignProduct[] = [
	...HOBBY_GAMES_CAMPAIGN_PRODUCTS,
	...HOBBY_GAMES_STANDALONE_PRODUCTS,
];

export const HOBBY_GAMES_BASE_URL = "https://hobbygames.ru";

/** Cycles that mix many products — never sum by cycle alone. */
export const HOBBY_GAMES_SHARED_CYCLES = new Set([
	"side_stories",
	"parallel",
	"promotional",
	"return",
	"zffg",
	"small_campaign_expansions",
]);
