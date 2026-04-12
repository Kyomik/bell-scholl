import { Notify } from "../helpers/helper-notif";

export class ApiService {
    static async call(url, methode = 'GET', data = null, successMessage = null) {
        const config = {
            method: methode,
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        };

        if (methode !== 'GET') {
            config.headers['Content-Type'] = 'application/json';
            config.headers['X-XSRF-TOKEN'] = this.getCsrfToken();
        }

        if (data) {
            config.body = JSON.stringify(data);
        }

        let response;
        try {
            response = await fetch(url, config);
        } catch (err) {
            console.error('Network error:', err);
            this.showAlert('Koneksi error', 'error');
            throw err;
        }

        // CSRF expired handler
        if (response.status === 419) {
            await this.refreshCsrf();
            config.headers['X-XSRF-TOKEN'] = this.getCsrfToken();
            try {
                response = await fetch(url, config);
            } catch (err) {
                console.error('Network error after CSRF refresh:', err);
                this.showAlert('Koneksi error', 'error');
                throw err;
            }
        }

        const result = await response.json();

        if (!response.ok) {
            const message = result.message || 'Terjadi kesalahan';
            this.showAlert(message, 'error');
            throw new Error(message);
        }
        // Jika ada successMessage, tampilkan (opsional)
        if (successMessage) {
            this.showAlert(successMessage, 'success');
        }
        return result;
    }

    static showAlert(message, type) {
        type == 'success' ? Notify.success(message) : Notify.error(message)
    }

    static async refreshCsrf() {
        await fetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include'
        });
    }

    static getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    static getCsrfToken() {
        const cookie = this.getCookie('XSRF-TOKEN');
        return cookie ? decodeURIComponent(cookie) : '';
    }
}