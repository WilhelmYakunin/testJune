class Slider {
    constructor(slider, { 
        autoplay = true, 
        inFrame = 1, 
        offset = 1, 
        interval = 4000,
        doted, 
        carosuleItemSelector, 
        carouselWarapperSelector,
        caroulesNextBtnSelector, 
        caroulesPrevBtnSelector,
        navigationItemClassName,
        navigationItemClassNameActive,
        dotsWarapperClassName } = {}) {

        this.slider = slider;
        this.inFrame = inFrame;
        this.offset = offset;
        this.interval = interval;
        this.doted = doted;
        this.allItems = slider.querySelectorAll('.' + carosuleItemSelector);
        this.itemCount = this.allItems.length;
        this.allFrames = this.getAllFrames();
        this.frameCount = this.allFrames.length;
        this.frameIndex = 0;
        this.wrapper = slider.querySelector(carouselWarapperSelector);
        this.nextButton = slider.querySelector('.' + caroulesNextBtnSelector);
        this.prevButton = slider.querySelector('.' + caroulesPrevBtnSelector);
        this.autoplay = autoplay; 
        this.paused = null;
        this.navigationItemClassName = navigationItemClassName;
        this.navigationItemClassNameActive = navigationItemClassNameActive;
        this.dotsWarapperClassName = dotsWarapperClassName;
        this.init();
    }

    getAllFrames() {
        let temp = [];
        for (let i = 0; i < this.itemCount; i++) {
            if (this.allItems[i + this.inFrame - 1] !== undefined) {
                temp.push(i);
            }
        }

        let allFrames = [];
        for (let i = 0; i < temp.length; i = i + this.offset) {
            allFrames.push(temp[i]);
        }
        if (allFrames[allFrames.length - 1] !== temp[temp.length - 1]) {
            allFrames.push(temp[temp.length - 1]);
        }
        return allFrames;
    }

    hideInActive() {
        this.allItems.forEach((slide, slideIndex) => {
            if (slideIndex >= (this.frameIndex + 1) * this.inFrame - this.inFrame 
                    && slideIndex < (this.frameIndex + 1) * this.inFrame) {
                slide.classList.add(carosuleItemSelector);
                slide.hidden = false;
            } else {
                slide.classList.remove(carosuleItemSelector);
                slide.hidden = true;
            } 
        });
        this.dotButtons.forEach((dot, dotIndex) => {
            if (dotIndex === this.frameIndex) {
                dot.hidden = false;
                dot.classList.add(this.navigationItemClassNameActive);
            } else {
                dot.hidden = true;
                dot.classList.remove(this.navigationItemClassNameActive)
            }
        })
    }

    next() {
        if ((this.frameIndex + 1 * this.inFrame + this.inFrame) > this.itemCount ) return;
        this.frameIndex += 1;
        this.hideInActive();
    }

    prev() {
        if (this.frameIndex - 1 < 0) return;
        this.frameIndex -= 1;
        this.hideInActive();
    }

    play() {
        this.paused = setInterval(() => this.next(), this.interval);
    }

    dots() {
        const ol = document.createElement('ol');
        ol.className = this.dotsWarapperClassName;
        const children = [];
        for (let i = 0; i < this.frameCount; i++) {
            let li = document.createElement('li'); 
            li.classList.add(this.navigationItemClassName)
            if (!this.doted) {
                li.innerHTML = (i + 1) * this.inFrame;
                li.hidden = true;
            };
            if (i === this.inFrame - 1) {
                li.classList.add(this.navigationItemClassNameActive);

                li.hidden = false;
            };
            ol.append(li);
            children.push(li);
        }

        const allItemValue = document.createElement('span');
        allItemValue.className = this.navigationItemClassName;
        allItemValue.innerHTML = '/' + this.itemCount;
        this.prevButton.after(allItemValue);
        this.prevButton.after(ol);
        return children;
    }

    init() {
        this.dotButtons = this.dots();
        this.hideInActive();

        this.nextButton.addEventListener('click', event => {
            event.preventDefault();
            this.next();
        });

        this.prevButton.addEventListener('click', event => {
            event.preventDefault();
            this.prev();
        });

        this.dotButtons.forEach(dot => {
            dot.addEventListener('click', event => {
                event.preventDefault();
                const frameIndex = this.dotButtons.indexOf(event.target);
                if (frameIndex === this.frameIndex) return;
                this.goto(frameIndex);
            });
        });

        if (this.autoplay) {
            this.play();
            this.slider.addEventListener('mouseenter', () => clearInterval(this.paused));
            this.slider.addEventListener('mouseleave', () => this.play());
        }
    }
}

const blockName = 'participants';
const carosuleItemSelector = blockName + '-swiper__slide';
const carouselWarapperSelector = '.carousel-slides';
const caroulesNextBtnSelector = blockName + '__swipper-next';
const caroulesPrevBtnSelector = blockName + '__swipper-prev';
const navigationItemClassName = blockName + '__current-item';
const navigationItemClassNameActive = blockName + '__current-item--active';
const dotsWarapperClassName = blockName + '__dots-wrapper';
let inFrame = 1;
let offset = 1;

if (window.innerWidth > 375) {
    inFrame = 3;
    offset = 3;
}

document.addEventListener('DOMContentLoaded', function() {
    new Slider(document.querySelector('.carousel'), {
        inFrame: inFrame, 
        offset: offset,
        autoplay: false,
        doted: false,
        interval: 4000,
        carosuleItemSelector, 
        carouselWarapperSelector, 
        caroulesNextBtnSelector, 
        caroulesPrevBtnSelector,
        navigationItemClassName,
        navigationItemClassNameActive,
        dotsWarapperClassName
    });
});