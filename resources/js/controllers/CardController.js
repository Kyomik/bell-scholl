import { AlaramList } from "../components/AlaramList";
import { FormAlaram } from "../components/FormAlaram";
import { SubmitButton } from "../components/SubmitButton";
import wsManager from "../core/ws-instance";
import { alertProfesional } from "../engine/alertProfesional";
import { Notify } from "../helpers/helper-notif";

export class CardController{
    constructor(componentId){
        this.component = document.getElementById(componentId)
        // this.mobileSetting = new MobileSetting(this.component)
        this.#init();
    }

    #init(){
        this.#initElements()
        this.#initComponents()
        this.#setupEventListener()
    }

    #initComponents(){
        this.list = new AlaramList(
            this.component.querySelector('.card-back'),
            'alarm-list',
            // this.ws
        )
        this.formAlarm = new FormAlaram(this, this.component.querySelector('.card-front'))
        this.clearAllSubmit = new SubmitButton(this.component, 'clear-all')
        this.syncSubmit = new SubmitButton(this.component, 'sync-alarms')
    }

    #initElements(){
        this.syncBtn = this.component.querySelector('#sync-alarms')
        this.clearAllBtn = this.component.querySelector('#clear-all')
        this.flipToListBtn = this.component.querySelector('#flip-to-list')
        this.flipToSetupBtn = this.component.querySelector('#flip-to-setup')
    }

    #setupEventListener(){
        this.flipToListBtn.addEventListener('click', () => {
            this.component.classList.add('flipped');
        })

        this.flipToSetupBtn.addEventListener('click', () => {
            this.component.classList.remove('flipped')
        })

        this.clearAllBtn.addEventListener('click', this.#handleClearAll.bind(this))
        this.syncBtn.addEventListener('click', this.#handleSync.bind(this))
    }

    async #handleSync(){
        if(this.list.data.length === 0) {
            Notify.info('Tidak ada alarm untuk disinkronisasi');
            return;
        }
        await this.syncSubmit.submit(async () => { 
            wsManager.send({
                event: 'sync-alarm',
                data: {
                    sesis: this.list.data
                }
            })
        })

    }

    async #handleClearAll(){
        try {
            if(this.list.data.length === 0) {
                Notify.info('Tidak ada alarm untuk dihapus');
                return;
            }

            alertProfesional.fire({
                title: 'Question',
                text: 'Apakah anda ingin melanjutkan menginput data penjualannya?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                animation: {
                    show: 'slideUp',
                    hide: 'slideDown' 
                },
                onConfirm: async () =>{
                    await this.clearAllSubmit.submit(async () => {
                        wsManager.send({
                            event: 'destroy-all-sesi',
                            data: {}
                        })
                    });
                }
            });
            
        } catch (error) {
            console.log(error)
        }
    }

    flipped(){
        // setTimeout(() => {
        this.component.classList.add('flipped');
        // }, 500);
    }

    closeAllLoadingButtonChildren(){
        // Form alarm submit button
        if (this.formAlarm?.submitButton) {
            this.formAlarm.submitButton.setLoading(false);
        }
        // Delete button of the current list item (if exists)
        if (this.list?.item?.deleteSubmit) {
            this.list.item.deleteSubmit.setLoading(false);
        }
        // Clear all button
        if (this.clearAllSubmit) {
            this.clearAllSubmit.setLoading(false);
        }
        // Sync button
        if (this.syncSubmit) {
            this.syncSubmit.setLoading(false);
        }
        // Audio upload button
        if (this.formAlarm.audioSelection.audioUpload.uploadBtn) {
            console.log('wo')
            this.formAlarm.audioSelection.audioUpload.uploadBtn.setLoading(false);
        }
        
        this.formAlarm.audioSelection.audioUpload.hideModal()
    }

    setLoading(isLoading) {
        if (this.uploadBtn) {
            this.uploadBtn.setLoading(isLoading);
        }
    }
}