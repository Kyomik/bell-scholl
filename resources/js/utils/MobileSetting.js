export class MobileSetting{
    container(component){
        this.component = component
        this.touchStartX = 0;
        this.touchEndX = 0;

        init()
    }

    init(){
        this.setupEventListener();
    }

    setupEventListener(){
        this.component.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        this.component.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (swipeDistance < -swipeThreshold && !this.component.classList.contains('flipped')) {
            this.component.classList.add('flipped');
        }
        else if (swipeDistance > swipeThreshold && this.component.classList.contains('flipped')) {
            this.component.classList.remove('flipped');
        }
    }
}