// utils/AlarmStorage.js

export class AlarmStorage {
    static STORAGE_KEY = 'alarms';

    /**
     * Mendapatkan semua alarm dari localStorage
     * @returns {Array} array of alarm objects
     */
    static getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Gagal parse alarms dari localStorage', e);
            return [];
        }
    }

    /**
     * Menyimpan array alarm ke localStorage
     * @param {Array} alarms 
     */
    static saveAll(alarms) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(alarms));
    }

    /**
     * Menambahkan satu alarm
     * @param {Object} alarm 
     * @returns {Array} alarm baru yang sudah ditambahkan (dengan id jika perlu)
     */
    static add(alarm) {
        const alarms = this.getAll();
        // Pastikan alarm memiliki id unik (jika belum ada)
        if (!alarm.id) {
            alarm.id = Date.now(); // atau gunakan uuid
        }
        alarms.push(alarm);
        this.saveAll(alarms);
        return alarm;
    }

    /**
     * Menghapus alarm berdasarkan id
     * @param {number|string} id 
     * @returns {boolean} true jika berhasil dihapus
     */
    static delete(id) {
        let alarms = this.getAll();
        const initialLength = alarms.length;
        alarms = alarms.filter(item => item.id != id); // gunakan != untuk konversi tipe
        if (alarms.length === initialLength) return false;
        this.saveAll(alarms);
        return true;
    }

    /**
     * Memperbarui alarm
     * @param {Object} updatedAlarm 
     * @returns {Object|null} alarm yang sudah diperbarui atau null jika tidak ditemukan
     */
    static update(updatedAlarm) {
        const alarms = this.getAll();
        const index = alarms.findIndex(item => item.id == updatedAlarm.id);
        if (index === -1) return null;
        alarms[index] = { ...alarms[index], ...updatedAlarm };
        this.saveAll(alarms);
        return alarms[index];
    }

    /**
     * Menghapus semua alarm
     */
    static deleteAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Menginisialisasi data awal jika localStorage kosong
     * @param {Array} defaultAlarms 
     */
    static initDefault(defaultAlarms = []) {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.saveAll(defaultAlarms);
        }
    }

    /**
     * Mengambil semua data untuk keperluan sync ke server
     * @returns {Array}
     */
    static getForSync() {
        return this.getAll();
    }
}