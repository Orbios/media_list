interface RawgGame {
  id: number;
  rawgId: number;
  slug: string;
  name: string;
  playtime: number;
  platforms: Platform[];
  stores: {Store}[];
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: any;
  metacritic: number;
  suggestions_count: number;
  updated: string;
  score: string;
  tags: Tag[];
  esrb_rating: any;
  genres: RawgGameGenre[];
}

interface Platform {
  id: number;
  name: string;
  slug: string;
}

interface Store {
  id: number;
  name: string;
  slug: string;
}

interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

interface RawgGameGenre {
  id: number;
  name: string;
  slug: string;
}
