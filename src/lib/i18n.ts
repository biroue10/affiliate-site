export type Locale = 'fr' | 'en';

export const CATEGORY_PATHS = {
	fr: {
		ai: '/ai/',
		guides: '/guides/',
		comparatifs: '/comparatifs/',
		rencontres: '/rencontres/',
	},
	en: {
		ai: '/en/ai-companions/',
		guides: '/en/guides/',
		comparatifs: '/en/comparisons/',
		rencontres: '/en/adult-dating/',
	},
} as const;

export const CATEGORY_LABELS = {
	fr: { ai: 'Compagnons IA', guides: 'Guides', comparatifs: 'Comparatifs', rencontres: 'Rencontres' },
	en: { ai: 'AI companions', guides: 'Guides', comparatifs: 'Comparisons', rencontres: 'Adult dating' },
} as const;

/** Explicit editorial URL pairs. Never infer a translation from a slug. */
export const ARTICLE_TRANSLATIONS = {
	'ai-girlfriend-confidentialite-securite': { fr: '/guides/ai-girlfriend-confidentialite-securite/', en: '/en/guides/ai-girlfriend-privacy/' },
	'ai-girlfriend-gratuite-2026': { fr: '/guides/ai-girlfriend-gratuite-2026/', en: '/en/guides/free-ai-girlfriend-2026/' },
	'ai-girlfriend-images-verifier-avant-payer': { fr: '/guides/ai-girlfriend-images-verifier-avant-payer/', en: '/en/guides/ai-girlfriend-images-before-paying/' },
	'ai-girlfriend-memoire': { fr: '/guides/ai-girlfriend-memoire/', en: '/en/guides/ai-girlfriend-memory/' },
	'alternatives-candy-ai-2026': { fr: '/comparatifs/alternatives-candy-ai-2026/', en: '/en/comparisons/candy-ai-alternatives-2026/' },
	'candy-ai-avis': { fr: '/ai/candy-ai-avis/', en: '/en/ai-companions/candy-ai-review-2026/' },
	'candy-ai-fiable-2026': { fr: '/guides/candy-ai-fiable-2026/', en: '/en/guides/is-candy-ai-safe-2026/' },
	'candy-ai-gratuit-limites': { fr: '/guides/candy-ai-gratuit-limites/', en: '/en/guides/candy-ai-free-limits-2026/' },
	'candy-ai-vs-ourdream-2026': { fr: '/comparatifs/candy-ai-vs-ourdream-2026/', en: '/en/comparisons/candy-ai-vs-ourdream-2026/' },
	'comment-annuler-candy-ai': { fr: '/guides/comment-annuler-candy-ai/', en: '/en/guides/cancel-candy-ai/' },
	'comment-supprimer-compte-ourdream': { fr: '/guides/comment-supprimer-compte-ourdream/', en: '/en/guides/delete-ourdream-account/' },
	'lovescape-avis': { fr: '/ai/lovescape-avis/', en: '/en/ai-companions/lovescape-review-2026/' },
	'lovescape-vs-candy-ai-2026': { fr: '/comparatifs/lovescape-vs-candy-ai-2026/', en: '/en/comparisons/lovescape-vs-candy-ai-2026/' },
	'meilleure-ai-girlfriend-francais-2026': { fr: '/ai/meilleure-ai-girlfriend-francais-2026/', en: '/en/ai-companions/best-ai-girlfriends-2026/' },
	'meilleure-ai-girlfriend-voix-francais-2026': { fr: '/comparatifs/meilleure-ai-girlfriend-voix-francais-2026/', en: '/en/comparisons/best-ai-girlfriend-voice-2026/' },
	'ourdream-avis': { fr: '/ai/ourdream-avis/', en: '/en/ai-companions/ourdream-review-2026/' },
	'ourdream-fiable-2026': { fr: '/guides/ourdream-fiable-2026/', en: '/en/guides/is-ourdream-safe-2026/' },
	'ourdream-gratuit-limites': { fr: '/guides/ourdream-gratuit-limites/', en: '/en/guides/ourdream-free-limits/' },
	'site-rencontre-discret': { fr: '/rencontres/site-rencontre-discret/', en: '/en/adult-dating/discreet-dating-sites/' },
	'site-rencontre-sans-abonnement': { fr: '/rencontres/site-rencontre-sans-abonnement/', en: '/en/adult-dating/dating-sites-without-subscription/' },
	'site-rencontre-sans-photo-obligatoire': { fr: '/rencontres/site-rencontre-sans-photo-obligatoire/', en: '/en/adult-dating/dating-sites-without-required-photos/' },
} as const;

const categoryPairs = Object.entries(CATEGORY_PATHS.fr).map(([key, fr]) => ({
	fr,
	en: CATEGORY_PATHS.en[key as keyof typeof CATEGORY_PATHS.en],
}));

const articlePairs = Object.values(ARTICLE_TRANSLATIONS);

export function getAlternatePath(pathname: string, locale: Locale) {
	const pair = [...categoryPairs, ...articlePairs].find((item) => item.fr === pathname || item.en === pathname);
	return pair?.[locale];
}

export function getLocale(pathname: string): Locale {
	return pathname.startsWith('/en/') ? 'en' : 'fr';
}
