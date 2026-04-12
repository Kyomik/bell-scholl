import wsManager from "../core/ws-instance";
import { SubmitButton } from "./SubmitButton";

export class Alaram{
    constructor(parent, data){
        const element = document.createElement('div');
        element.className = 'alarm-item';
        element.dataset.index = data.time
        this.parent = parent
        this.component = this.#render(element, data)
        
        this.#init();
    }

    #init(){
        this.#initComponents()
    }

    #initComponents(){
        this.deleteSubmit = new SubmitButton(this.component, 'delete-alarm')
        // this.updateSubmit = new SubmitButton(this.component, 'update-alarm')
    }

    #render(element, data){
        element.innerHTML = `
            <div class="alarm-time">${data.time}</div>
            <div class="alarm-days">${this.#elementDays(data.days)}</div>
            <div class="alarm-actions">
                <button class="action-btn delete" id="delete-alarm">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `;

        // <button class="action-btn update" id="update-alarm">
        //     <i class="far fa-edit"></i>
        // </button>

        

        element.addEventListener('click', (e) => { this.#handleClick(e) })
        
        return element
    }

    async #handleClick(e){
        if (!e.target.closest('.action-btn.delete')) return;
        e.stopPropagation();

        try {
            const time = this.component.dataset.index
            
            if (e.target.closest('.action-btn.delete')) {
                await this.deleteSubmit.submit(async () => {
                    wsManager.send({
                        event: 'destroy-sesi',
                        data: {
                            time: time
                        }
                    })
                })
            // }else if (e.target.closest('.action-btn.update')) {
            //     const response = await this.updateSubmit.submit(async () => {
            //         return await ApiService.call(
            //             `${url}/${id}`, 
            //             'PUT'
            //         );
            //     })
                
            //     result = response.id;
            //     mode = 'update';
            }
        } catch (error) {
            console.log(error)
        }
    }
        

    #elementDays(days){
        let dayElements = '';
        const displayDays = days.slice(0, 3);
        const extraDays = days.length - 3;
            
        displayDays.forEach(day => {
            dayElements += `<span class="alarm-day">${day}</span>`;
        });
        
        if (extraDays > 0) {
            dayElements += `<span class="alarm-day">+${extraDays}</span>`;
        }

        return dayElements;
    }
}