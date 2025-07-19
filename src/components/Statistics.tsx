import React from 'react';
import { BarChart3, TrendingUp, BookOpen, Users, Hash, Calendar } from 'lucide-react';
import { Statistics as StatsType } from '../types';

interface StatisticsProps {
  statistics: StatsType;
  isVisible: boolean;
  onClose: () => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ 
  statistics, 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-book-paper rounded-lg shadow-book max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-book-primary" />
              <h2 className="text-2xl font-book font-bold text-book-text">
                摘抄统计
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-book-accent hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <span className="text-book-muted text-xl">×</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 基本统计 */}
            <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-book-accent border-opacity-30">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-book-primary" />
                <h3 className="font-book font-semibold text-book-text">基本统计</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-book-muted font-book">总摘抄数：</span>
                  <span className="font-bold text-book-text">{statistics.totalExcerpts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-book-muted font-book">总字数：</span>
                  <span className="font-bold text-book-text">{statistics.totalWords.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-book-muted font-book">总字符数：</span>
                  <span className="font-bold text-book-text">{statistics.totalCharacters.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 热门作者 */}
            <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-book-accent border-opacity-30">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-book-primary" />
                <h3 className="font-book font-semibold text-book-text">热门作者</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {statistics.topAuthors.slice(0, 5).map((author, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-book-text font-book truncate flex-1">{author.author}</span>
                    <span className="bg-book-primary text-white px-2 py-1 rounded-full text-xs ml-2">
                      {author.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 热门作品 */}
            <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-book-accent border-opacity-30">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-book-primary" />
                <h3 className="font-book font-semibold text-book-text">热门作品</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {statistics.topWorks.slice(0, 5).map((work, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-book-text font-book truncate flex-1">{work.work}</span>
                    <span className="bg-book-accent text-white px-2 py-1 rounded-full text-xs ml-2">
                      {work.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 热门标签 */}
            <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-book-accent border-opacity-30 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-3 mb-3">
                <Hash className="w-6 h-6 text-book-primary" />
                <h3 className="font-book font-semibold text-book-text">热门标签</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {statistics.topTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-book-accent bg-opacity-20 text-book-text rounded-full text-sm font-book"
                  >
                    {tag.tag}
                    <span className="bg-book-primary text-white px-2 py-0.5 rounded-full text-xs">
                      {tag.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* 创建趋势 */}
            {statistics.creationTrend.length > 0 && (
              <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-book-accent border-opacity-30 md:col-span-2 lg:col-span-3">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-book-primary" />
                  <h3 className="font-book font-semibold text-book-text">创建趋势（近30天）</h3>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {statistics.creationTrend.slice(-10).map((trend, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-book-muted font-book">{trend.date}</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="bg-book-primary h-2 rounded-full"
                          style={{ width: `${Math.max(trend.count * 20, 10)}px` }}
                        />
                        <span className="text-book-text font-book w-8 text-right">{trend.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};