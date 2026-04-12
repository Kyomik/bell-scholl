import { toastProfesional } from "../engine/toastProfesional";

export class Notify {
    static success(message) {
        toastProfesional.create({
            type: 'success',
            text: message,
            title: 'Success',
            position: 'top-right',
            theme: 'glass'
        });
    }

    static error(message) {
        toastProfesional.create({
            type: 'error',
            text: message,
            title: 'Error',
            position: 'top-right',
            theme: 'glass'
        });
    }

    static info(message) {
        toastProfesional.create({
            type: 'info',
            text: message,
            title: 'Info',
            position: 'top-right',
            theme: 'glass'
        });
    }

    static warning(message) {
        toastProfesional.create({
            type: 'warning',
            text: message,
            title: 'warning',
            position: 'top-right',
            theme: 'glass'
        });
    }
}