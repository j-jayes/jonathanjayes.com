import raw from '../../../../data/instagram.json';

export interface Post {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string;
  image: string;
  width: number;
  height: number;
  count: number;
}

export interface Feed {
  fetchedAt: string | null;
  username: string | null;
  posts: Post[];
}

export const feed = raw as Feed;
