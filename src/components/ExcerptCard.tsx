import React from 'react';
import { Edit, Trash2, Calendar, User, BookOpen, Tag } from 'lucide-react';
import { Excerpt } from '../types';

interface ExcerptCardProps {
  excerpt: Excerpt;
  onEdit: (excerpt: Excerpt) => void;
  onDelete: (id: string) => void;
  searchQuery?: string;
}

export const ExcerptCard: React.FC<ExcerptCardProps> = ({ 
  excerpt, 
  onEdit, 
  onDelete, 
  searchQuery 
}) => {
  const highlightText = (text: string, query?: string): string => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这条摘抄吗？')) {
      onDelete(excerpt.id);
    }
  };

  return (
    <div className="bg-book-paper rounded-lg shadow-page border border-book-accent border-opacity-30 p-6 hover:shadow-book transition-all duration-300 animate-fade-in">
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2 text-sm text-book-muted">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="font-book">{excerpt.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span 
                className="font-book"
                dangerouslySetInnerHTML={{ 
                  __html: highlightText(excerpt.author, searchQuery) 
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span 
                className="font-book"
                dangerouslySetInnerHTML={{ 
                  __html: highlightText(excerpt.workTitle, searchQuery) 
                }}
              />
            </div>
          </div>
          
          {/* 标签 */}
          {excerpt.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-book-muted" />
              <div className="flex flex-wrap gap-1">
                {excerpt.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-book-accent bg-opacity-20 text-book-text rounded-full text-xs font-book"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(excerpt)}
            className="p-2 text-book-muted hover:text-book-primary hover:bg-book-accent hover:bg-opacity-20 rounded-lg transition-colors"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-book-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 摘抄内容 */}
      <div className="mb-4">
        <div className="bg-white bg-opacity-50 rounded-lg p-4 border-l-4 border-book-primary">
          <p 
            className="text-book-text leading-relaxed font-book whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: highlightText(excerpt.content, searchQuery) 
            }}
          />
        </div>
      </div>

      {/* 批注 */}
      {excerpt.annotation && (
        <div className="bg-book-accent bg-opacity-10 rounded-lg p-4 border-l-4 border-book-accent">
          <p 
            className="text-book-muted text-sm leading-relaxed font-book whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: highlightText(excerpt.annotation, searchQuery) 
            }}
          />
        </div>
      )}

      {/* 创建时间 */}
      <div className="text-xs text-book-muted mt-4 pt-3 border-t border-book-accent border-opacity-20 font-book">
        创建于 {new Date(excerpt.createdAt).toLocaleString('zh-CN')}
        {excerpt.updatedAt !== excerpt.createdAt && (
          <span className="ml-2">
            · 修改于 {new Date(excerpt.updatedAt).toLocaleString('zh-CN')}
          </span>
        )}
      </div>
    </div>
  );
};