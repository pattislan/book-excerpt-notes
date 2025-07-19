import { Excerpt } from '../types';

export const exportToJSON = (excerpts: Excerpt[]) => {
  const dataStr = JSON.stringify(excerpts, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `摘抄记录_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToTXT = (excerpts: Excerpt[]) => {
  const txtContent = excerpts.map(excerpt => {
    return `日期：${excerpt.date}\n` +
           `作者：${excerpt.author}\n` +
           `作品：${excerpt.workTitle}\n` +
           `标签：${excerpt.tags.join(', ')}\n` +
           `摘抄：\n${excerpt.content}\n` +
           `批注：\n${excerpt.annotation}\n` +
           '---\n';
  }).join('\n');
  
  const dataBlob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `摘抄记录_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (excerpts: Excerpt[]) => {
  const headers = ['日期', '作者', '作品', '标签', '摘抄内容', '批注'];
  const csvContent = [
    headers.join(','),
    ...excerpts.map(excerpt => [
      `"${excerpt.date}"`,
      `"${excerpt.author}"`,
      `"${excerpt.workTitle}"`,
      `"${excerpt.tags.join('; ')}"`,
      `"${excerpt.content.replace(/"/g, '""')}"`,
      `"${excerpt.annotation.replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');
  
  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `摘抄记录_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<Excerpt[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // 验证数据格式
        if (Array.isArray(data) && data.every(item => 
          item.id && item.content && item.author && item.workTitle
        )) {
          resolve(data);
        } else {
          reject(new Error('无效的JSON格式'));
        }
      } catch (error) {
        reject(new Error('JSON解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file, 'utf-8');
  });
};

export const backupData = (excerpts: Excerpt[]) => {
  const backupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    excerpts: excerpts
  };
  
  const dataStr = JSON.stringify(backupData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `摘抄备份_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const restoreData = (file: File): Promise<Excerpt[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.excerpts && Array.isArray(data.excerpts)) {
          resolve(data.excerpts);
        } else if (Array.isArray(data)) {
          // 兼容直接的数组格式
          resolve(data);
        } else {
          reject(new Error('无效的备份文件格式'));
        }
      } catch (error) {
        reject(new Error('备份文件解析失败'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file, 'utf-8');
  });
};