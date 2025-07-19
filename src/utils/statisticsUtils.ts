import { Excerpt, Statistics } from '../types';

export const calculateStatistics = (excerpts: Excerpt[]): Statistics => {
  const totalExcerpts = excerpts.length;
  
  // 字数统计
  const totalWords = excerpts.reduce((sum, excerpt) => {
    const words = excerpt.content.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').length;
    return sum + words;
  }, 0);
  
  const totalCharacters = excerpts.reduce((sum, excerpt) => {
    return sum + excerpt.content.length + excerpt.annotation.length;
  }, 0);
  
  // 作者统计
  const authorCounts = excerpts.reduce((acc, excerpt) => {
    acc[excerpt.author] = (acc[excerpt.author] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topAuthors = Object.entries(authorCounts)
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // 作品统计
  const workCounts = excerpts.reduce((acc, excerpt) => {
    acc[excerpt.workTitle] = (acc[excerpt.workTitle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topWorks = Object.entries(workCounts)
    .map(([work, count]) => ({ work, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // 标签统计
  const tagCounts = excerpts.reduce((acc, excerpt) => {
    excerpt.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
  
  // 创建趋势
  const dateCounts = excerpts.reduce((acc, excerpt) => {
    const date = excerpt.createdAt.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const creationTrend = Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // 最近30天
  
  return {
    totalExcerpts,
    totalWords,
    totalCharacters,
    topAuthors,
    topWorks,
    topTags,
    creationTrend
  };
};