import { Notify } from "../helpers/helper-notif";

export class SubmitButton {
    constructor(parent, elementId) {
        this.submitBtn = parent.querySelector(`#${elementId}`);
        this.originalContent = this.submitBtn.innerHTML; 
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalContent;
        }
    }

    async submit(fn) {
        this.setLoading(true);
        try {
            await fn();
        } catch (error) {
            Notify.error(error);
            throw error;
        } finally {
            // this.setLoading(false);
        }
    }
}