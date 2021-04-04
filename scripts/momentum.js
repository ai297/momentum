// Временный список цитат. Сделать свой api цитатника с возможностью добавления новых цитат
const QUOTES = [
    { quote: 'I am your father', author: 'Darth Vader'},
    { quote: 'Do, or do not. There is no "try"', author: 'Master Yoda'},
    { quote: 'Only a Sith deals in absolutes', author: 'Obi-Wan Kenobi'},
    { quote: 'Let the past die. Kill it if you have to', author: 'Kylo Ren'},
    { quote: 'Be careful not to choke on your aspirations', author: 'Darth Vader'},
    { quote: 'It is unavoidable. It is your destiny', author: 'Palpatine'},
    { quote: 'You underestimate the power of the Dark Side', author: 'Darth Vader'},
    { quote: 'I’ve got a bad feeling about this', author: ''},
    { quote: 'Much to learn you still have', author: 'Maser Yoda'},
    { quote: 'May the Force be with you', author: ''},
    { quote: 'In my experience, there is no such thing as luck', author: 'Obi-Wan Kenobi'},
    { quote: 'Your focus determines your reality', author: 'Qui-Gon Jinn'},
    { quote: 'Somebody has to save our skins', author: 'Leia Organa'},
    { quote: 'I find your lack of faith disturbing', author: 'Darth Vader'},
    { quote: 'It’s a trap!', author: 'Admiral Ackbar'},
    { quote: 'So this is how liberty dies…with thunderous applause', author: 'Padme Amidala'},
    { quote: 'Your eyes can deceive you. Don’t trust them', author: 'Obi-Wan Kenobi'},
    { quote: 'Never tell me the odds', author: 'Han Solo'},
    { quote: 'Great, kid. Don’t get cocky', author: 'Han Solo'},
    { quote: 'Stay on target', author: 'Gold Five'},
    { quote: 'This is a new day, a new beginning', author: 'Ahsoka Tano'},
    { quote: 'The Force will be with you. Always.', author: 'Obi-Wan Kenobi'},
    { quote: 'Why, you stuck-up, half-witted, scruffy-looking nerf herder!', author: 'Leia Organa'},
    { quote: 'Now, young Skywalker, you will die.', author: 'Emperor Palpatine'},
    { quote: 'There’s always a bigger fish', author: 'Qui-Gon Jinn'},
    { quote: 'Fear is the path to the dark side. Fear leads to anger; anger leads to hate; hate leads to suffering. I sense much fear in you', author: 'Master Yoda'},
    { quote: 'Well, if droids could think, there’d be none of us here, would there?', author: 'Obi-Wan Kenobi'},
    { quote: 'I’m just a simple man trying to make my way in the universe', author: 'Jango Fett'},
    { quote: 'Power! Unlimited power!', author: 'Darth Sidious'}
]

const WEATHER_API_KEY = 'd41b5bc266d36bf941417bd6adc0ed3d';

class Momentum {
    greetings = [
        'Good Morning', 'Good Day', 'Good Evening', 'Good Night'
    ];

    constructor(images) {
        this._images = [];
        for(let i = 0; i < 6; i++) {
            this._images[i] = document.createElement('img');
            this._images[i + 6] = document.createElement('img');
            this._images[i + 12] = document.createElement('img');
            this._images[i + 18] = document.createElement('img');

            this._images[i].src = this._getRandom(images.night);
            this._images[i + 6].src = this._getRandom(images.morning);
            this._images[i + 12].src = this._getRandom(images.day);
            this._images[i + 18].src = this._getRandom(images.evening);

            this._images[i].addEventListener('load', () => this._imgLoader(this));
            this._images[i + 6].addEventListener('load', () => this._imgLoader(this));
            this._images[i + 12].addEventListener('load', () => this._imgLoader(this));
            this._images[i + 18].addEventListener('load', () => this._imgLoader(this));
        }
        this._currentImage = 0;
    }

    _getRandom(from) {
        if(from.length == 1) return from[0];
        let randIndex = Math.floor(Math.random() * from.length);
    
        return from.splice(randIndex, 1)[0];
    }
    _imgLoader(momentum) {
        momentum.loadedImages = momentum.loadedImages || 0;
        momentum.loadedImages++;

        document.dispatchEvent(new CustomEvent('image-loading',
            { 
                bubbles: true,
                detail: Math.round(momentum.loadedImages * 100 / 24)
            }
        ));
    }

    getGreeting(hour) {
        if(hour >= 6 && hour < 12)
            return this.greetings[0];
        if(hour >= 12 && hour < 18)
            return this.greetings[1];
        if(hour >= 18 && hour <= 23)
            return this.greetings[2];
        return this.greetings[3];
    }

    changeImage(elem, id = -1) {
        if(id < 0) this._currentImage = this._currentImage < 23 ? this._currentImage + 1 : 0;
        else this._currentImage = id < 24 ? id : this._currentImage;

        elem.style.backgroundImage = `url(${this._images[this._currentImage].src})`;
    }

    namePlaceholder = '[Your Name]';
    focusPlaceholder = '[Your Focus]';
    cityPlaceholder = '[Enter Your City]';

    get userName() {
        return localStorage.getItem('user-name') || this.namePlaceholder;
    }
    set userName(value) {
        if(value.trim() == '')
            localStorage.removeItem('user-name');
        else if(value != this.namePlaceholder )
            localStorage.setItem('user-name', value);
    }

    get dayFocus() {
        let expires = localStorage.getItem('focus-expires');
        if(expires !== undefined && expires > Date.now())
            return localStorage.getItem('day-focus') || this.focusPlaceholder;
        else return this.focusPlaceholder;
    }
    set dayFocus(value) {
        if(value.trim() == '') {
            localStorage.removeItem('day-focus');
            localStorage.removeItem('focus-expires');
        }
        else if(value != this.namePlaceholder ) {
            localStorage.setItem('day-focus', value);
            let now = new Date();
            localStorage.setItem('focus-expires', now.getTime() + ((24 - now.getHours()) * 60 - now.getMinutes()) * 60 * 1000);
        }
    }

    get userCity() {
        return localStorage.getItem('user-city') || this.cityPlaceholder;
    }
    set userCity(value) {
        if(value.trim() == '') {
            localStorage.removeItem('user-city');
        }
        else if(value != this.cityPlaceholder) {
            localStorage.setItem('user-city', value);
        }
    }

    getQuote() {
        return new Promise((resolve, reject) => {
            let randIndex;
            do {
                randIndex = Math.floor(Math.random() * QUOTES.length);
            } while (randIndex == this._prevQuote);
            this._prevQuote = randIndex;
            resolve(QUOTES[randIndex]);
        });
    }

    getWeather() {
        if(this.userCity == this.cityPlaceholder) throw Error('City does not set');
        const url = encodeURI(`https://api.openweathermap.org/data/2.5/weather?q=${this.userCity}&lang=en&appid=${WEATHER_API_KEY}&units=metric`);
        return fetch(url).then(res => {
            if (!res.ok) throw Error(res.statusText);
            return res.json();
        });
    }
}