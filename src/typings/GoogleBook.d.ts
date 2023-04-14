interface GoogleBook {
  id?: number;
  googleId: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
}

interface VolumeInfo {
  title: string;
  subtitle?: string;
  description?: string;
  authors: string[];
  categories: string[];
  publisher?: string;
  publishedDate: string;
  industryIdentifiers: IndustryIdentifier[];
  pageCount: number;
  language: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
}

interface IndustryIdentifier {
  type: string;
  identifier: string;
}
