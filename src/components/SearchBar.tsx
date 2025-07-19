import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Calendar, User, BookOpen, Tag } from 'lucide-react';
import { SearchFilters } from '../types';
import { extractAllTags, extractAllAuthors, extractAllWorks } from '../utils/searchUtils';
import { Excerpt } from '../types';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  allExcerpts: Excerpt[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  filters, 
  onFiltersChange, 
  allExcerpts 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags);
  const [authorInput, setAuthorInput] = useState(filters.author);
  const [workInput, setWorkInput] = useState(filters.workTitle);
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);
  const [showWorkSuggestions, setShowWorkSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const workRef = useRef<HTMLInputElement>(null);

  const allTags = extractAllTags(allExcerpts);
  const allAuthors = extractAllAuthors(allExcerpts);
  const allWorks = extractAllWorks(allExcerpts);

  // 获取筛选后的作者建议
  const getAuthorSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return allAuthors.filter(author => 
      author.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  // 获取筛选后的作品建议
  const getWorkSuggestions = (query: string) => {
    if (!query.trim()) return [];
    return allWorks.filter(work => 
      work.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authorRef.current && !authorRef.current.contains(event.target as Node)) {
        setShowAuthorSuggestions(false);
      }
      if (workRef.current && !workRef.current.contains(event.target as Node)) {
        setShowWorkSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleAuthorInputChange = (value: string) => {
    setAuthorInput(value);
    handleFilterChange('author', value);
    setShowAuthorSuggestions(value.trim().length > 0);
  };

  const handleWorkInputChange = (value: string) => {
    setWorkInput(value);
    handleFilterChange('workTitle', value);
    setShowWorkSuggestions(value.trim().length > 0);
  };

  const handleAuthorSuggestionClick = (author: string) => {
    setAuthorInput(author);
    handleFilterChange('author', author);
    setShowAuthorSuggestions(false);
  };

  const handleWorkSuggestionClick = (work: string) => {
    setWorkInput(work);
    handleFilterChange('workTitle', work);
    setShowWorkSuggestions(false);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setAuthorInput('');
    setWorkInput('');
    onFiltersChange({
      query: '',
      tags: [],
      author: '',
      workTitle: '',
      dateRange: { start: '', end: '' }
    });
  };

  const hasActiveFilters = filters.query || filters.tags.length > 0 || 
    filters.author || filters.workTitle || filters.dateRange.start || filters.dateRange.end;

  return (
    <div className="bg-book-paper rounded-lg shadow-page border border-book-accent border-opacity-30 p-4 mb-6">
      {/* 主搜索框 */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-book-muted" />
          <input
            ref={searchRef}
            type="text"
            value={filters.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="搜索摘抄内容、作者、作品或批注... (Ctrl+F)"
            className="w-full pl-10 pr-4 py-3 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
            showAdvanced 
              ? 'bg-book-primary text-white border-book-primary' 
              : 'bg-white text-book-text border-book-accent hover:bg-book-accent hover:bg-opacity-20'
          }`}
        >
          <Filter className="w-5 h-5" />
          高级筛选
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            清除
          </button>
        )}
      </div>

      {/* 高级筛选 */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-book-accent border-opacity-20 animate-slide-up">
          {/* 作者和作品筛选 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative" ref={authorRef}>
              <label className="flex items-center gap-2 text-sm font-medium text-book-text mb-2">
                <User className="w-4 h-4" />
                作者
              </label>
              <input
                type="text"
                value={authorInput}
                onChange={(e) => handleAuthorInputChange(e.target.value)}
                onFocus={() => setShowAuthorSuggestions(authorInput.trim().length > 0)}
                className="w-full px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                placeholder="输入作者名字..."
              />
              {showAuthorSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-book-accent rounded-lg shadow-lg max-h-32 overflow-y-auto z-10">
                  {getAuthorSuggestions(authorInput).map((author, index) => (
                    <button
                      key={index}
                      onClick={() => handleAuthorSuggestionClick(author)}
                      className="w-full px-3 py-2 text-left hover:bg-book-accent hover:bg-opacity-20 text-book-text font-book"
                    >
                      {author}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" ref={workRef}>
              <label className="flex items-center gap-2 text-sm font-medium text-book-text mb-2">
                <BookOpen className="w-4 h-4" />
                作品
              </label>
              <input
                type="text"
                value={workInput}
                onChange={(e) => handleWorkInputChange(e.target.value)}
                onFocus={() => setShowWorkSuggestions(workInput.trim().length > 0)}
                className="w-full px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                placeholder="输入作品名称..."
              />
              {showWorkSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-book-accent rounded-lg shadow-lg max-h-32 overflow-y-auto z-10">
                  {getWorkSuggestions(workInput).map((work, index) => (
                    <button
                      key={index}
                      onClick={() => handleWorkSuggestionClick(work)}
                      className="w-full px-3 py-2 text-left hover:bg-book-accent hover:bg-opacity-20 text-book-text font-book"
                    >
                      {work}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 日期范围 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-book-text mb-2">
              <Calendar className="w-4 h-4" />
              日期范围
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterChange('dateRange', { 
                  ...filters.dateRange, 
                  start: e.target.value 
                })}
                className="px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                placeholder="开始日期"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterChange('dateRange', { 
                  ...filters.dateRange, 
                  end: e.target.value 
                })}
                className="px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                placeholder="结束日期"
              />
            </div>
          </div>

          {/* 标签筛选 */}
          {allTags.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-book-text mb-2">
                <Tag className="w-4 h-4" />
                标签
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-book-primary text-white'
                        : 'bg-book-accent bg-opacity-20 text-book-text hover:bg-book-accent hover:bg-opacity-30'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};