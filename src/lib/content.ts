import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategorySlug } from '../consts';

export async function getPublishedPosts(category?: CategorySlug) {
	const posts = (await getCollection('blog')).filter(({ data }) => {
		if (data.draft === true) {
			return false;
		}

		if (category && data.category !== category) {
			return false;
		}

		return true;
	});

	return posts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export function getPostPath(post: CollectionEntry<'blog'>) {
	return `/${post.data.category}/${post.id}/`;
}
