interface Book {
  id: number;
  googleId: string;
  selfLink?: string;
  title: string;
  alternativeTitle?: string;
  subtitle?: string;
  description?: string;
  authors: string[];
  genres: string[];
  publishedDate: number;
  pageCount: number;
  language?: string;
  posterUrl: string;
  lists: number[];
}
