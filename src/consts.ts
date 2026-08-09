export const SITE_TITLE = 'Clairlia';

export const SITE_DESCRIPTION =
	'Avis, comparatifs et guides indépendants sur les services de rencontre et les compagnons IA pour adultes.';

export const SITE_TAGLINE =
	'Comparer, comprendre et choisir en connaissance de cause.';

export const SITE_LANG = 'fr';
export const SITE_LOCALE = 'fr_FR';
export const SITE_AUTHOR = 'Équipe éditoriale';

export const SITE_CATEGORIES = [
	{
		slug: 'avis',
		label: 'Avis',
		description: 'Analyses détaillées de plateformes et services.',
	},
	{
		slug: 'comparatifs',
		label: 'Comparatifs',
		description: 'Comparaisons directes entre plusieurs services.',
	},
	{
		slug: 'guides',
		label: 'Guides',
		description: 'Conseils pratiques, sécurité et confidentialité.',
	},
	{
		slug: 'rencontres',
		label: 'Rencontres',
		description: 'Guides et comparatifs autour des rencontres pour adultes.',
	},
	{
		slug: 'ai',
		label: 'Compagnons IA',
		description: 'Analyses des services de compagnons et partenaires IA.',
	},
] as const;

export type CategorySlug = (typeof SITE_CATEGORIES)[number]['slug'];
