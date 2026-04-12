import { SubmitButton } from "./SubmitButton";
import { AudioSelection } from "./AudioSelection";
import { TimeSelection } from "./TimeSelection";
import { DaysSelection } from "./DaysSelection";
import { Notify } from "../helpers/helper-notif";
import wsManager from "../core/ws-instance";

export class FormAlaram {
    constructor(parent, component) {
        this.parent = parent;

        this.component = component;
        this.url = this.component.action;
        this.isInitialized = false;
        
        this.#init();
    }

    #init(){
        this.#disableSubmitButton(true);
        this.#initComponents();
        this.#initElements();
        this.#setupEventListener();

        this.isInitialized = true;
        this.#disableSubmitButton(false);
    }

    #disableSubmitButton(disabled) {
        const submitBtn = this.component.querySelector('#add-alarm');
        if (submitBtn) {
            submitBtn.disabled = disabled;
        }
    }

    #initElements(){
        this.resetButton = this.component.querySelector('#reset-time')
    }
    
    #initComponents(){
        this.submitButton = new SubmitButton(this.component, 'add-alarm');
        this.audioSelection = new AudioSelection(this.component, 'audio-selection');
        this.timeSelection = new TimeSelection(this.component, 'time-selection');
        this.daysSelection = new DaysSelection(this.component, 'days-selection');
    }

    #setupEventListener() {
        this.component.addEventListener('submit', (e) => this.#handleSubmit(e));
        this.resetButton.addEventListener('click', () => { this.#handleReset() })
    }
    
    async #handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        
        if(!this.#validatedFormData(formData)) return;
        
        await this.submitButton.submit(async () => {
            wsManager.send({
                event: 'create-sesi',
                data: formData
            })
        });
    }

    #handleReset(){
        this.audioSelection.reset()
        this.timeSelection.reset()
        this.daysSelection.reset()
    }
    
    getFormData() {
        return {
            audio: this.audioSelection.getAudio(),
            time: this.timeSelection.getTime(),
            days: this.daysSelection.getDays()
        };
    }

    #validatedFormData(formData) {
        try {
            // if(this.parent.list.data.some(item => item.time === formData.time)) {
            //     throw new Error('Alarm dengan waktu yang sama sudah ada.');
            // }
            if (formData.days.length === 0) {
                throw new Error('Pilih minimal satu hari untuk alarm.');
            }
            if (formData.audio === null){
                throw new Error('Pilih audio untuk alarm.');
            }
            return true;
            
        } catch (error) {
            Notify.info(error.message);
            throw error;
        }
    }
}