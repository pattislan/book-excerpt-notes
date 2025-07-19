export interface Excerpt {
  id: string;
  date: string;
  content: string;
  annotation: string;
  author: string;
  workTitle: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExportFormat {
  format: 'json' | 'txt' | 'csv';
  data: Excerpt[];
}

export interface Statistics {
  totalExcerpts: number;
  totalWords: number;
  totalCharacters: number;
  topAuthors: { author: string; count: number }[];
  topWorks: { work: string; count: number }[];
  topTags: { tag: string; count: number }[];
  creationTrend: { date: string; count: number }[];
}

export interface SearchFilters {
  query: string;
  tags: string[];
  author: string;
  workTitle: string;
  dateRange: {
    start: string;
    end: string;
  };
}