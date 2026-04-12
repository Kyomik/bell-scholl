import { formatTime } from "../helpers/helper-global";

export class TimeSelection{
    constructor(parent, elementId){
        this.component = parent.querySelector(`#${elementId}`);
        this.currentHour = this.getDevaultValue().hour
        this.currentMinute = this.getDevaultValue().minute
        this.init();
    }

    init(){
        this.initElements();
        this.setupEventListener();
        this.updateTimeDisplay()
    }

    initElements(){
        this.hourDisplay = this.component.querySelector('#hour-display');
        this.minuteDisplay = this.component.querySelector('#minute-display')
        
        this.hourUpBtn = this.component.querySelector('#hour-up')
        this.hourDownBtn = this.component.querySelector('#hour-down')
        this.minuteUpBtn = this.component.querySelector('#minute-up')
        this.minuteDownBtn = this.component.querySelector('#minute-down')
    }

    setupEventListener(){
        this.hourUpBtn.addEventListener('click', () => {
            this.currentHour = (this.currentHour + 1) % 24;
            this.updateTimeDisplay();
        });

        this.hourDownBtn.addEventListener('click', () => {
            this.currentHour = (this.currentHour - 1 + 24) % 24;
            this.updateTimeDisplay();
        });

        this.minuteUpBtn.addEventListener('click', () => {
            this.currentMinute = (this.currentMinute + 1) % 60;
            this.updateTimeDisplay();
        });

        this.minuteDownBtn.addEventListener('click', () => {
            this.currentMinute = (this.currentMinute - 1 + 60) % 60;
            this.updateTimeDisplay();
        });
    }

    updateTimeDisplay() {
        this.hourDisplay.textContent = formatTime(this.currentHour);
        this.minuteDisplay.textContent = formatTime(this.currentMinute);
    }

    getTime(){
        return `${formatTime(this.currentHour)}:${formatTime(this.currentMinute)}`;
    }

    getDevaultValue(){
        return {hour: 7, minute: 30}
    }

    reset(){
        this.currentHour = this.getDevaultValue().hour
        this.currentMinute = this.getDevaultValue().minute
        this.updateTimeDisplay()
    }
}