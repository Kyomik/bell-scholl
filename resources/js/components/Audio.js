export class Audio {
    constructor(parent, data, checked) {
        // Ubah dari 'div' menjadi 'label'
        const element = document.createElement('label');
        element.className = 'audio-option';
        
        this.parent = parent;
        this.component = this.#render(element, data);
        this.checked = checked;
        
        return this.component;
    }

    #render(element, data) {
        element.innerHTML = `
            <input type="radio" name="audio" value="${data.id}" ${this.checked ? 'checked' : ''}>
            <div class="audio-option-content">
                <i class="fas fa-bell"></i>
                <span>${data.label}</span>
            </div>
        `;
        return element;
    }
}