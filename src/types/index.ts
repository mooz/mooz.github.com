export type PublicationType = 'journal' | 'conference' | 'workshop' | 'preprint';
export type NewsType = 'publication' | 'award' | 'talk' | 'event';

export type Publication = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  url?: string;
  type: PublicationType;
};

export type NewsItem = {
  date: string;
  title: string;
  content: string;
  type: NewsType;
  url?: string;
};

// シリアライズ可能な型（サーバーからクライアントへの受け渡し用）
export type SerializablePublication = Omit<Publication, 'type'> & {
  type: string;
};

export type SerializableNewsItem = Omit<NewsItem, 'type'> & {
  type: string;
  url?: string;
};
