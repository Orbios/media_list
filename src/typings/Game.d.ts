interface Game {
  id: number;
  rawgId: number;
  title: string;
  alternativeTitle?: string;
  slug: string;
  description: string;
  website: string;
  released: number;
  genres: string[];
  developers: string;
  posterUrl: string;
  rating: number;
  ratingTop: number;
  lists: number[];
}
