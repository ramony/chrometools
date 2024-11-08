class HistoryManager {
  constructor(maxHistory = 20) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = maxHistory;
  }

  // 添加新的历史记录
  push(state) {
    // 如果当前不在最新状态，删除后面的历史
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // 添加新状态
    this.history.push(state);

    // 如果超出最大历史数量，删除最早的记录
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.currentIndex = this.history.length - 1;
  }

  // 撤销
  undo() {
    if (this.canUndo()) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  // 重做
  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  // 是否可以撤销
  canUndo() {
    return this.currentIndex > 0;
  }

  // 是否可以重做
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  // 获取当前状态
  getCurrentState() {
    return this.history[this.currentIndex];
  }

  // 清空历史
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

export default HistoryManager; 