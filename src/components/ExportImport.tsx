import React, { useRef } from 'react';
import { Download, Upload, FileText, FileJson, Sheet, Archive, RotateCcw } from 'lucide-react';
import { Excerpt } from '../types';
import { 
  exportToJSON, 
  exportToTXT, 
  exportToCSV, 
  importFromJSON, 
  backupData, 
  restoreData 
} from '../utils/exportUtils';

interface ExportImportProps {
  excerpts: Excerpt[];
  onImport: (excerpts: Excerpt[]) => void;
  onRestore: (excerpts: Excerpt[]) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const ExportImport: React.FC<ExportImportProps> = ({ 
  excerpts, 
  onImport, 
  onRestore, 
  isVisible, 
  onClose 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedExcerpts = await importFromJSON(file);
      onImport(importedExcerpts);
      alert(`成功导入 ${importedExcerpts.length} 条摘抄！`);
    } catch (error) {
      alert(`导入失败：${error}`);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (window.confirm('恢复备份将替换所有现有数据，确定继续吗？')) {
      try {
        const restoredExcerpts = await restoreData(file);
        onRestore(restoredExcerpts);
        alert(`成功恢复 ${restoredExcerpts.length} 条摘抄！`);
        onClose();
      } catch (error) {
        alert(`恢复失败：${error}`);
      } finally {
        if (backupInputRef.current) {
          backupInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-book-paper rounded-lg shadow-book max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Archive className="w-6 h-6 text-book-primary" />
              <h2 className="text-2xl font-book font-bold text-book-text">
                数据管理
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-book-accent hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <span className="text-book-muted text-xl">×</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* 数据导出 */}
            <div>
              <h3 className="text-lg font-book font-semibold text-book-text mb-4 flex items-center gap-2">
                <Download className="w-5 h-5" />
                数据导出
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => exportToJSON(excerpts)}
                  className="flex items-center gap-3 p-4 bg-white border border-book-accent rounded-lg hover:bg-book-accent hover:bg-opacity-20 transition-colors"
                >
                  <FileJson className="w-6 h-6 text-book-primary" />
                  <div className="text-left">
                    <div className="font-book font-medium text-book-text">JSON 格式</div>
                    <div className="text-sm text-book-muted">结构化数据</div>
                  </div>
                </button>
                <button
                  onClick={() => exportToTXT(excerpts)}
                  className="flex items-center gap-3 p-4 bg-white border border-book-accent rounded-lg hover:bg-book-accent hover:bg-opacity-20 transition-colors"
                >
                  <FileText className="w-6 h-6 text-book-primary" />
                  <div className="text-left">
                    <div className="font-book font-medium text-book-text">文本格式</div>
                    <div className="text-sm text-book-muted">易读格式</div>
                  </div>
                </button>
                <button
                  onClick={() => exportToCSV(excerpts)}
                  className="flex items-center gap-3 p-4 bg-white border border-book-accent rounded-lg hover:bg-book-accent hover:bg-opacity-20 transition-colors"
                >
                  <Sheet className="w-6 h-6 text-book-primary" />
                  <div className="text-left">
                    <div className="font-book font-medium text-book-text">CSV 格式</div>
                    <div className="text-sm text-book-muted">表格数据</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 数据导入 */}
            <div>
              <h3 className="text-lg font-book font-semibold text-book-text mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                数据导入
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm font-book">
                  ℹ️ 导入将与现有数据合并，不会覆盖现有内容。仅支持 JSON 格式文件。
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-3 p-4 bg-book-primary text-white rounded-lg hover:bg-book-secondary transition-colors"
              >
                <Upload className="w-5 h-5" />
                选择 JSON 文件导入
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            {/* 数据备份与恢复 */}
            <div>
              <h3 className="text-lg font-book font-semibold text-book-text mb-4 flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                备份与恢复
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => backupData(excerpts)}
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Archive className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-book font-medium">创建备份</div>
                    <div className="text-sm">完整数据备份</div>
                  </div>
                </button>
                <button
                  onClick={() => backupInputRef.current?.click()}
                  className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <RotateCcw className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-book font-medium">恢复备份</div>
                    <div className="text-sm">替换所有数据</div>
                  </div>
                </button>
              </div>
              <input
                ref={backupInputRef}
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
              />
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-800 text-sm font-book">
                  ⚠️ 恢复备份将完全替换所有现有数据，请在操作前确保已创建当前数据的备份。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
