import React, { useState, useEffect, useMemo } from 'react';
import { Plus, BookOpenCheck, BarChart3, Archive, Keyboard, SortAsc, SortDesc } from 'lucide-react';
import { Excerpt, SearchFilters } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ExcerptForm } from './components/ExcerptForm';
import { ExcerptCard } from './components/ExcerptCard';
import { SearchBar } from './components/SearchBar';
import { Statistics } from './components/Statistics';
import { ExportImport } from './components/ExportImport';
import { searchExcerpts } from './utils/searchUtils';
import { calculateStatistics } from './utils/statisticsUtils';
import { KeyboardShortcutManager } from './utils/keyboardShortcuts';

type SortOption = 'date-desc' | 'date-asc' | 'author' | 'work';

function App() {
  const [excerpts, setExcerpts] = useLocalStorage<Excerpt[]>('book-excerpts', []);
  const [showForm, setShowForm] = useState(false);
  const [editingExcerpt, setEditingExcerpt] = useState<Excerpt | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    author: '',
    workTitle: '',
    dateRange: { start: '', end: '' }
  });

  // 计算统计数据
  const statistics = useMemo(() => calculateStatistics(excerpts), [excerpts]);

  // 搜索和筛选摘抄
  const filteredExcerpts = useMemo(() => {
    const searched = searchExcerpts(excerpts, filters);
    
    // 排序
    return searched.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'author':
          return a.author.localeCompare(b.author, 'zh-CN');
        case 'work':
          return a.workTitle.localeCompare(b.workTitle, 'zh-CN');
        default:
          return 0;
      }
    });
  }, [excerpts, filters, sortBy]);

  // 快捷键管理
  useEffect(() => {
    const shortcutManager = new KeyboardShortcutManager();

    shortcutManager.register({
      key: 'n',
      ctrlKey: true,
      description: '添加新摘抄',
      action: () => {
        setEditingExcerpt(null);
        setShowForm(true);
      }
    });

    shortcutManager.register({
      key: 's',
      ctrlKey: true,
      description: '查看统计',
      action: () => setShowStats(true)
    });

    shortcutManager.register({
      key: 'e',
      ctrlKey: true,
      description: '数据管理',
      action: () => setShowExportImport(true)
    });

    shortcutManager.register({
      key: '?',
      description: '显示快捷键帮助',
      action: () => setShowKeyboardHelp(true)
    });

    shortcutManager.register({
      key: 'Escape',
      description: '关闭对话框',
      action: () => {
        setShowForm(false);
        setShowStats(false);
        setShowExportImport(false);
        setShowKeyboardHelp(false);
        setEditingExcerpt(null);
      }
    });

    shortcutManager.startListening();

    return () => {
      shortcutManager.destroy();
    };
  }, []);

  const handleSaveExcerpt = (excerptData: Omit<Excerpt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingExcerpt) {
      // 编辑现有摘抄
      const updatedExcerpt: Excerpt = {
        ...editingExcerpt,
        ...excerptData,
        updatedAt: now
      };
      setExcerpts(prev => prev.map(e => e.id === editingExcerpt.id ? updatedExcerpt : e));
    } else {
      // 添加新摘抄
      const newExcerpt: Excerpt = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...excerptData,
        createdAt: now,
        updatedAt: now
      };
      setExcerpts(prev => [newExcerpt, ...prev]);
    }
    
    setShowForm(false);
    setEditingExcerpt(null);
  };

  const handleEditExcerpt = (excerpt: Excerpt) => {
    setEditingExcerpt(excerpt);
    setShowForm(true);
  };

  const handleDeleteExcerpt = (id: string) => {
    setExcerpts(prev => prev.filter(e => e.id !== id));
  };

  const handleImportExcerpts = (importedExcerpts: Excerpt[]) => {
    // 合并导入的数据，避免重复
    const existingIds = new Set(excerpts.map(e => e.id));
    const newExcerpts = importedExcerpts.filter(e => !existingIds.has(e.id));
    
    if (newExcerpts.length > 0) {
      setExcerpts(prev => [...newExcerpts, ...prev]);
    }
  };

  const handleRestoreExcerpts = (restoredExcerpts: Excerpt[]) => {
    setExcerpts(restoredExcerpts);
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'date-desc':
        return <SortDesc className="w-4 h-4" />;
      case 'date-asc':
        return <SortAsc className="w-4 h-4" />;
      default:
        return <SortAsc className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-book-bg bg-paper-texture">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 头部 */}
        <header className="mb-8">
          <div className="bg-book-paper rounded-lg shadow-book border border-book-accent border-opacity-30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpenCheck className="w-8 h-8 text-book-primary" />
                <div>
                  <h1 className="text-3xl font-book font-bold text-book-text">
                    如我所书
                  </h1>
                  <p className="text-book-muted font-book">
                    珍藏您的阅读时光，记录智慧的片段
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right text-sm text-book-muted font-book">
                  <div>共 {excerpts.length} 条摘抄</div>
                  <div>{statistics.totalWords.toLocaleString()} 个字</div>
                </div>
                
                <button
                  onClick={() => setShowKeyboardHelp(true)}
                  className="p-2 text-book-muted hover:text-book-primary hover:bg-book-accent hover:bg-opacity-20 rounded-lg transition-colors"
                  title="快捷键帮助 (?)"
                >
                  <Keyboard className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowStats(true)}
                  className="p-2 text-book-muted hover:text-book-primary hover:bg-book-accent hover:bg-opacity-20 rounded-lg transition-colors"
                  title="统计信息 (Ctrl+S)"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowExportImport(true)}
                  className="p-2 text-book-muted hover:text-book-primary hover:bg-book-accent hover:bg-opacity-20 rounded-lg transition-colors"
                  title="数据管理 (Ctrl+E)"
                >
                  <Archive className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    setEditingExcerpt(null);
                    setShowForm(true);
                  }}
                  className="bg-book-primary text-white px-4 py-2 rounded-lg hover:bg-book-secondary transition-colors flex items-center gap-2 font-book"
                  title="添加摘抄 (Ctrl+N)"
                >
                  <Plus className="w-5 h-5" />
                  添加摘抄
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 搜索栏 */}
        <SearchBar 
          filters={filters}
          onFiltersChange={setFilters}
          allExcerpts={excerpts}
        />

        {/* 排序工具栏 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-book-muted font-book text-sm">排序方式：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-book-paper border border-book-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-book-primary font-book text-sm"
            >
              <option value="date-desc">日期（新到旧）</option>
              <option value="date-asc">日期（旧到新）</option>
              <option value="author">作者</option>
              <option value="work">作品</option>
            </select>
            {getSortIcon()}
          </div>
          
          <div className="text-book-muted font-book text-sm">
            显示 {filteredExcerpts.length} / {excerpts.length} 条摘抄
          </div>
        </div>

        {/* 摘抄列表 */}
        <div className="space-y-6">
          {filteredExcerpts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenCheck className="w-16 h-16 text-book-muted mx-auto mb-4" />
              <h3 className="text-xl font-book text-book-muted mb-2">
                {excerpts.length === 0 ? '还没有摘抄记录' : '没有找到匹配的摘抄'}
              </h3>
              <p className="text-book-muted font-book mb-4">
                {excerpts.length === 0 
                  ? '开始您的阅读之旅，添加第一条摘抄吧！'
                  : '试试调整搜索条件或清除筛选器'
                }
              </p>
              {excerpts.length === 0 && (
                <button
                  onClick={() => {
                    setEditingExcerpt(null);
                    setShowForm(true);
                  }}
                  className="bg-book-primary text-white px-6 py-3 rounded-lg hover:bg-book-secondary transition-colors font-book"
                >
                  添加第一条摘抄
                </button>
              )}
            </div>
          ) : (
            filteredExcerpts.map(excerpt => (
              <ExcerptCard
                key={excerpt.id}
                excerpt={excerpt}
                onEdit={handleEditExcerpt}
                onDelete={handleDeleteExcerpt}
                searchQuery={filters.query}
              />
            ))
          )}
        </div>

        {/* 添加/编辑表单 */}
        {showForm && (
          <ExcerptForm
            excerpt={editingExcerpt || undefined}
            onSave={handleSaveExcerpt}
            onCancel={() => {
              setShowForm(false);
              setEditingExcerpt(null);
            }}
            allExcerpts={excerpts}
          />
        )}

        {/* 统计模态框 */}
        <Statistics
          statistics={statistics}
          isVisible={showStats}
          onClose={() => setShowStats(false)}
        />

        {/* 数据管理模态框 */}
        <ExportImport
          excerpts={excerpts}
          onImport={handleImportExcerpts}
          onRestore={handleRestoreExcerpts}
          isVisible={showExportImport}
          onClose={() => setShowExportImport(false)}
        />

        {/* 快捷键帮助 */}
        {showKeyboardHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-book-paper rounded-lg shadow-book max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-book font-bold text-book-text">
                    快捷键帮助
                  </h2>
                  <button
                    onClick={() => setShowKeyboardHelp(false)}
                    className="text-book-muted hover:text-book-text"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-book text-book-text">Ctrl + N</span>
                    <span className="text-book-muted font-book">添加新摘抄</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-book text-book-text">Ctrl + F</span>
                    <span className="text-book-muted font-book">聚焦搜索框</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-book text-book-text">Ctrl + S</span>
                    <span className="text-book-muted font-book">查看统计</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-book text-book-text">Ctrl + E</span>
                    <span className="text-book-muted font-book">数据管理</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-book text-book-text">?</span>
                    <span className="text-book-muted font-book">显示帮助</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-book text-book-text">Esc</span>
                    <span className="text-book-muted font-book">关闭对话框</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;