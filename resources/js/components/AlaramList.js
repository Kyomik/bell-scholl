import { Alaram } from "./Alaram";
import { byEarliestTime } from "../helpers/helper-global";
import { Notify } from "../helpers/helper-notif";

export class AlaramList{
    constructor(parent, elementId){
        this.parent = parent
        this.component = parent.querySelector(`#${elementId}`);
        this.data = this.getDevalutValue()
        this.#init()
    }

    #init(){
        this.render(this.data)
    }

    #elementBlank = `
        <div class="empty-state">
            <i class="far fa-bell-slash" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
            <p>Belum ada bell yang dijadwalkan</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Tambahkan bell di halaman pengaturan</p>
        </div>
    `
    render(dataList) {
        this.component.innerHTML = '';

        if (dataList.length === 0) {
            this.component.innerHTML = this.#elementBlank;
            return;
        }
        
        dataList.sort(byEarliestTime);

        dataList.forEach((data) => {
            this.item = new Alaram(this, data);
            this.component.appendChild(this.item.component);
        });
    }

    updateUI(data, mode) {
        let message;
        switch(mode) {
            case 'sync':
                message = 'Alarm berhasil disinkronisasi';
                break;
            case 'delete':
                console.log(data)
                this.data = this.data.filter(item => item.id !== data.id);
                message = 'Alarm berhasil dihapus';
                break;
                
            case 'add':
                console.log(data)
                this.data.push(data);
                message = 'Alarm berhasil ditambahkan';
                break;

            case 'update':
                const index = this.data.findIndex(item => item.id === data.id);
                if (index !== -1) this.data[index] = response;
                message = 'Alarm berhasil diperbarui';
                break;
            default:
                this.data = [];
                message = "Berhasil Menghapus Semua Alarm";
                break;
        }
        
        this.render(this.data);
        Notify.success(message);
    }

    getDevalutValue(){
        return JSON.parse(this.component.dataset.alarms);
    }
}