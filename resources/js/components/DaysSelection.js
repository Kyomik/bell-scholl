export class DaysSelection{
    constructor(parent, elementId){
        this.component = parent.querySelector(`#${elementId}`)
        this.selectedDays = this.getDevalutValue()
        
        this.init();
    }

    init(){
        this.initElements();
        this.setupEventListener();
        this.updateSelectedDays()
    }

    initElements(){
        this.dayButtons = this.component.querySelectorAll('.day-btn')
    }

    setupEventListener(){
        this.component.addEventListener('click', (e) => this.handleClick(e))
        this.component.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.component.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    handleClick(e){
        const button = e.target.closest('[data-day]');
        if (!button) return;

        const day = button.dataset.day;

        if (this.selectedDays.has(day)) {
            this.selectedDays.delete(day);
            button.classList.remove('selected');
        } else {
            this.selectedDays.add(day);
            button.classList.add('selected');
        }

        this.updateSelectedDays();
    }

    handleTouchStart(e){
        const button = e.target.closest('[data-day]');
        if (button) {
            button.classList.add('touch-active');
        }
    }

    handleTouchEnd(e){
        const button = e.target.closest('[data-day]');
        if (button) {
            button.classList.remove('touch-active');
        }
    }

    updateSelectedDays(){
        this.dayButtons.forEach(button => {
            const day = button.getAttribute('data-day');
            if (this.selectedDays.has(day)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    getDays(){
        return Array.from(this.selectedDays)
    }

    getDevalutValue(){
        return new Set(JSON.parse(this.component.dataset.haris));
    }

    reset(){
        this.selectedDays = this.getDevalutValue()
        this.updateSelectedDays()
    }
}