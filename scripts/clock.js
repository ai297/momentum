class Clock {
    months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December']
    weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    constructor(timeElement, dateElement) {
        this.timeElement = timeElement;
        this.dateElement = dateElement;
    }

    fixZero = n => n < 10 ? '0' + n : n;

    showTime() {
        let date = new Date();
        let hours = date.getHours();

        if(hours != this.hours) {
            document.dispatchEvent(new CustomEvent('change-hour',
                { 
                    bubbles: true,
                    detail: hours
                }
            ));
        }
        this.hours = hours;

        this.minutes = this.fixZero(date.getMinutes());
        this.seconds = this.fixZero(date.getSeconds());
        this.month = this.months[date.getMonth()];
        this.day = this.weekDays[date.getDay()];
        this.date = date.getDate();
        
        this.timeElement.innerHTML = 
            `${this.hours}:${this.minutes}:${this.seconds}`;

        this.dateElement.innerHTML =
            `${this.date} ${this.month}, ${this.day}`;

        setTimeout(() => {
            this.showTime();
        }, 1000);
    }

}