import React, { useState, useEffect } from 'react';
import { X, Plus, Save, BookOpen, ChevronLeft, Calendar } from 'lucide-react';
import { Excerpt } from '../types';
import { extractAllTags, extractAllAuthors, extractAllWorks } from '../utils/searchUtils';

interface ExcerptFormProps {
  excerpt?: Excerpt;
  onSave: (excerpt: Omit<Excerpt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  allExcerpts: Excerpt[];
}

export const ExcerptForm: React.FC<ExcerptFormProps> = ({ 
  excerpt, 
  onSave, 
  onCancel, 
  allExcerpts 
}) => {
  // 获取上次使用的日期，默认为今天
  const getInitialDate = () => {
    if (excerpt?.date) return excerpt.date;
    
    const lastUsedDate = localStorage.getItem('lastExcerptDate');
    if (lastUsedDate) {
      // 上次日期的明天
      const nextDay = new Date(lastUsedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    }
    
    return new Date().toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    date: getInitialDate(),
    content: excerpt?.content || '',
    annotation: excerpt?.annotation || '',
    author: excerpt?.author || '',
    workTitle: excerpt?.workTitle || '',
    tags: excerpt?.tags || []
  });
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState<{
    type: 'tags' | 'authors' | 'works';
    suggestions: string[];
  } | null>(null);

  const existingTags = extractAllTags(allExcerpts);
  const existingAuthors = extractAllAuthors(allExcerpts);
  const existingWorks = extractAllWorks(allExcerpts);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.date.trim()) {
      return;
    }
    // 保存使用的日期
    localStorage.setItem('lastExcerptDate', formData.date);
    onSave(formData);
  };

  const handleDateChange = (newDate: string) => {
    setFormData(prev => ({ ...prev, date: newDate }));
  };

  const gotoPreviousDay = () => {
    const currentDate = new Date(formData.date);
    currentDate.setDate(currentDate.getDate() - 1);
    handleDateChange(currentDate.toISOString().split('T')[0]);
  };

  const gotoToday = () => {
    handleDateChange(new Date().toISOString().split('T')[0]);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const getSuggestions = (type: 'tags' | 'authors' | 'works', value: string) => {
    const allItems = type === 'tags' ? existingTags : 
                    type === 'authors' ? existingAuthors : existingWorks;
    return allItems.filter(item => 
      item.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);
  };

  const handleInputFocus = (type: 'tags' | 'authors' | 'works', value: string) => {
    const suggestions = getSuggestions(type, value);
    if (suggestions.length > 0) {
      setShowSuggestions({ type, suggestions });
    }
  };

  const handleSuggestionClick = (suggestion: string, type: 'tags' | 'authors' | 'works') => {
    if (type === 'tags') {
      setNewTag(suggestion);
    } else if (type === 'authors') {
      setFormData(prev => ({ ...prev, author: suggestion }));
    } else {
      setFormData(prev => ({ ...prev, workTitle: suggestion }));
    }
    setShowSuggestions(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-book-paper rounded-lg shadow-book max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-book-primary" />
              <h2 className="text-2xl font-book font-bold text-book-text">
                {excerpt ? '编辑摘抄' : '添加摘抄'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-book-accent hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-book-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-book-text mb-2">
                  日期 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                    required
                  />
                  <button
                    type="button"
                    onClick={gotoPreviousDay}
                    className="px-3 py-2 bg-book-accent bg-opacity-20 text-book-text rounded-lg hover:bg-book-accent hover:bg-opacity-30 transition-colors"
                    title="上一日"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={gotoToday}
                    className="px-3 py-2 bg-book-primary text-white rounded-lg hover:bg-book-secondary transition-colors"
                    title="今天"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              <div>
                <label className="block text-sm font-medium text-book-text mb-2">
                  作者
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  onFocus={(e) => handleInputFocus('authors', e.target.value)}
                  className="w-full px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                  placeholder="输入作者名字"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-book-text mb-2">
                  作品名
                </label>
                <input
                  type="text"
                  value={formData.workTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, workTitle: e.target.value }))}
                  onFocus={(e) => handleInputFocus('works', e.target.value)}
                  className="w-full px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                  placeholder="输入作品名称"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-book-text mb-2">
                摘抄内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white h-32 resize-none font-book"
                placeholder="输入摘抄内容..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-book-text mb-2">
                批注
              </label>
              <textarea
                value={formData.annotation}
                onChange={(e) => setFormData(prev => ({ ...prev, annotation: e.target.value }))}
                className="w-full px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white h-24 resize-none font-book"
                placeholder="输入个人批注和感想..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-book-text mb-2">
                标签
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-book-accent bg-opacity-20 text-book-text rounded-full text-sm font-book"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-book-muted hover:text-book-text"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  onFocus={(e) => handleInputFocus('tags', e.target.value)}
                  className="flex-1 px-3 py-2 border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary bg-white font-book"
                  placeholder="输入标签"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-book-primary text-white rounded-lg hover:bg-book-secondary transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-book-primary text-white py-3 px-6 rounded-lg hover:bg-book-secondary transition-colors flex items-center justify-center gap-2 font-book"
              >
                <Save className="w-5 h-5" />
                {excerpt ? '保存修改' : '添加摘抄'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-book-accent text-book-text rounded-lg hover:bg-book-accent hover:bg-opacity-20 transition-colors font-book"
              >
                取消
              </button>
            </div>
          </form>

          {/* 提示列表 */}
          {showSuggestions && (
            <div className="absolute z-10 mt-1 bg-white border border-book-accent rounded-lg shadow-lg max-h-32 overflow-y-auto">
              {showSuggestions.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion, showSuggestions.type)}
                  className="w-full px-3 py-2 text-left hover:bg-book-accent hover:bg-opacity-20 text-book-text font-book"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};