class DotttedSlider {
    constructor(slider, { 
        autoplay = true, 
        inFrame = 1, 
        offset = 1, 
        interval = 4000,
        doted, 
        featuresCarosuleItemSelector, 
        featuresCarouselWarapperSelector,
        featuresCaroulesNextBtnSelector, 
        featuresCaroulesPrevBtnSelector,
        featuresNavigationItemClassName,
        featuresNavigationItemClassNameActive,
        featuresDotsWarapperClassName } = {}) {

        this.slider = slider;
        this.inFrame = inFrame;
        this.offset = offset;
        this.interval = interval;
        this.doted = doted;
        this.allItems = slider.querySelectorAll('.' + featuresCarosuleItemSelector);
        this.itemCount = this.allItems.length;
        this.allFrames = this.getAllFrames();
        this.frameCount = this.allFrames.length;
        this.frameIndex = inFrame;
        this.wrapper = slider.querySelector(featuresCarouselWarapperSelector);
        this.nextButton = slider.querySelector('.' + featuresCaroulesNextBtnSelector);
        this.prevButton = slider.querySelector('.' + featuresCaroulesPrevBtnSelector);
        this.autoplay = autoplay; 
        this.paused = null;
        this.navigationItemClassName = featuresNavigationItemClassName;
        this.navigationItemClassNameActive = featuresNavigationItemClassNameActive;
        this.dotsWarapperClassName = featuresDotsWarapperClassName;
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

    goto(index) {
        if (index > this.frameCount - 1) {
            this.frameIndex = 0;
        } else if (index < 0) {
            this.frameIndex = this.frameCount - 1;
        } else {
            this.frameIndex = index;
        }
        this.move();
    }

    next() {
        this.goto(this.frameIndex + 1);
    }

    prev() {
        this.goto(this.frameIndex - 1);
    }

    hideInActive() {
        this.allItems.forEach((slide, slideIndex) => {
            if (slideIndex >= this.frameIndex) {
                slide.classList.add(carosuleItemSelector);
                slide.hidden = false;
            } else {
                slide.classList.remove(carosuleItemSelector);
                slide.hidden = true;
            } 
        });
    }

    move() {
        this.hideInActive();
        if (!this.doted) {
            this.dotButtons.forEach(dot => dot.hidden = true);
            this.dotButtons[this.frameIndex].hidden = false;
        }
        this.dotButtons.forEach(dot => dot.classList.remove(this.navigationItemClassNameActive));
        this.dotButtons[this.frameIndex].classList.add(this.navigationItemClassNameActive);
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
            if (i === 0) {
                li.classList.add(this.navigationItemClassNameActive);
                li.hidden = false;
            };
            ol.append(li);
            children.push(li);
        }
        if (!this.doted) {
            const allItemValue = document.createElement('span');
            allItemValue.className = this.navigationItemClassName;
            allItemValue.innerHTML = '/' + this.itemCount;
            this.prevButton.after(allItemValue);
        }
        this.prevButton.after(ol);
        return children;
    }

    init() {
        this.dotButtons = this.dots(); // создать индикатор текущего кадра
        this.hideInActive();

        this.nextButton.addEventListener('click', event => {
            event.preventDefault();
            this.next();
        });

        this.prevButton.addEventListener('click', event => {
            event.preventDefault();
            this.prev();
        });

        // клики по кнопкам индикатора текущего кадра
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

const featuresBlockName = 'features';
const featuresCarosuleItemSelector = featuresBlockName + '-swiper__slide';
const featuresCarouselWarapperSelector = featuresBlockName + '__carousel-slides';
const featuresCaroulesNextBtnSelector = featuresBlockName + '__swipper-next';
const featuresCaroulesPrevBtnSelector = featuresBlockName + '__swipper-prev';
const featuresNavigationItemClassName = featuresBlockName + '__current-item';
const featuresNavigationItemClassNameActive = featuresBlockName + '__current-item--active';
const featuresDotsWarapperClassName = featuresBlockName + '__dots-wrapper';

document.addEventListener('DOMContentLoaded', () => {
    new DotttedSlider(document.querySelector('.' + featuresBlockName +'__carousel'), {
        inFrame: 1, 
        offset: 1,
        autoplay: false,
        doted: false,
        interval: 4000,
        featuresCarosuleItemSelector, 
        featuresCarouselWarapperSelector, 
        featuresCaroulesNextBtnSelector, 
        featuresCaroulesPrevBtnSelector,
        featuresNavigationItemClassName,
        featuresNavigationItemClassNameActive,
        featuresDotsWarapperClassName
    });
});