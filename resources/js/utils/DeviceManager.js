export class DeviceManager {
    constructor() {
        this.devices = this.loadFromStorage() || [];
    }

    // Simpan ke localStorage
    saveToStorage() {
        try {
            localStorage.setItem('deviceManager_devices', JSON.stringify(this.devices));
        } catch (e) {
            console.warn('Failed to save devices to localStorage', e);
        }
    }

    // Muat dari localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('deviceManager_devices');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.warn('Failed to load devices from localStorage', e);
            return null;
        }
    }

    // Hapus data (misal saat logout)
    clear() {
        this.devices = [];
        localStorage.removeItem('deviceManager_devices');
    }

    // Snapshot awal, ganti seluruh daftar
    setSnapshot(devices) {
        console.log('setSnapshot received:', devices);
        this.devices = devices.data.map(d => ({
            id: d.id,
            deviceId: d.deviceId,
            ip: d.ip || '0.0.0.0',
            state: d.state
        }));
        this.saveToStorage();
    }

    // Tambah atau perbarui device (untuk event device-connected, device-update, dll)
    addOrUpdateDevice(result) {
        const device = result.data
        const index = this.devices.findIndex(d => d.id == device.id);
        const newDevice = {
            id: device.id,
            deviceId: device.deviceId,
            ip: device.ip || '0.0.0.0',
            state: device.state
        };

        if (index >= 0) {
            // Update existing
            this.devices[index] = { ...this.devices[index], ...newDevice };
        } else {
            // Add new
            this.devices.push(newDevice);
        }
        this.saveToStorage();
    }

    // Perbarui state device (untuk device-suspend, device-disconnect, dll)
    updateDeviceState(result) {
        const device = result.data
        const dev = this.devices.find(d => d.id == device.id);
        if (dev) {
            dev.state = device.state || dev.state;
            this.saveToStorage();
        }
    }

    // Mendapatkan jumlah device aktif (tidak offline)
    getActiveCount() {
        return this.devices.filter(d => d.state !== 'OFFLINE').length;
    }
}

export const deviceManager = new DeviceManager();