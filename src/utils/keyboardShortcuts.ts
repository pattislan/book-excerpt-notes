export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  description: string;
  action: () => void;
}

export class KeyboardShortcutManager {
  private shortcuts: KeyboardShortcut[] = [];
  private isListening = false;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  register(shortcut: KeyboardShortcut) {
    this.shortcuts.push(shortcut);
  }

  unregister(key: string) {
    this.shortcuts = this.shortcuts.filter(s => s.key !== key);
  }

  startListening() {
    if (!this.isListening) {
      document.addEventListener('keydown', this.handleKeyDown);
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.isListening) {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.isListening = false;
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    // 忽略输入框中的快捷键
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const shortcut = this.shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.altKey === event.altKey &&
      !!s.shiftKey === event.shiftKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  getShortcuts(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }

  destroy() {
    this.stopListening();
    this.shortcuts = [];
  }
}