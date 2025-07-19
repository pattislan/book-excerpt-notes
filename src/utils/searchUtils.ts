import { Excerpt, SearchFilters } from '../types';

export const searchExcerpts = (excerpts: Excerpt[], filters: SearchFilters): Excerpt[] => {
  return excerpts.filter(excerpt => {
    // 文本搜索
    const queryMatch = !filters.query || 
      excerpt.content.toLowerCase().includes(filters.query.toLowerCase()) ||
      excerpt.annotation.toLowerCase().includes(filters.query.toLowerCase()) ||
      excerpt.author.toLowerCase().includes(filters.query.toLowerCase()) ||
      excerpt.workTitle.toLowerCase().includes(filters.query.toLowerCase());
    
    // 作者筛选
    const authorMatch = !filters.author || 
      excerpt.author.toLowerCase().includes(filters.author.toLowerCase());
    
    // 作品筛选
    const workMatch = !filters.workTitle || 
      excerpt.workTitle.toLowerCase().includes(filters.workTitle.toLowerCase());
    
    // 标签筛选
    const tagsMatch = filters.tags.length === 0 || 
      filters.tags.some(tag => excerpt.tags.includes(tag));
    
    // 日期筛选
    const dateMatch = (!filters.dateRange.start || excerpt.date >= filters.dateRange.start) &&
                     (!filters.dateRange.end || excerpt.date <= filters.dateRange.end);
    
    return queryMatch && authorMatch && workMatch && tagsMatch && dateMatch;
  });
};

export const highlightText = (text: string, query: string): string => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

export const extractAllTags = (excerpts: Excerpt[]): string[] => {
  const allTags = excerpts.flatMap(excerpt => excerpt.tags);
  return [...new Set(allTags)].sort();
};

export const extractAllAuthors = (excerpts: Excerpt[]): string[] => {
  const allAuthors = excerpts.map(excerpt => excerpt.author);
  return [...new Set(allAuthors)].sort();
};

export const extractAllWorks = (excerpts: Excerpt[]): string[] => {
  const allWorks = excerpts.map(excerpt => excerpt.workTitle);
  return [...new Set(allWorks)].sort();
};