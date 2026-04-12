export class AudioStorage {
  static STORAGE_KEY = 'metadata-audio';
  
  static load() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  static save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static getDefaultData() {
    return [
      { id: 'bell1', label: 'Bel 1' },
      { id: 'bell2', label: 'Bel 2' },
      { id: 'bell3', label: 'Bel 3' }
    ];
  }

  static update(newData) {
    const existing = this.load();
    if (!existing.some(item => item.id === newData.id)) {
      existing.push(newData);
      this.save(existing);
    }
    return existing;
  }
}