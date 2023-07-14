class carousel {
    #params = {
        mouseDown: 0,
        dragX: 0,
        endDrag: 0,
        index: 0
    }
    constructor({ slider, elements, indicator, btnNext, btnPrev }) {
        this.slider = slider
        this.elements = elements
        this.indicator = indicator
        this.btnNext = btnNext
        this.btnPrev = btnPrev
        this.state = false
        this.indicator.textContent = `${this.#params.index + 1} / ${this.elements.length}`
        this.#event()
    }
    get length() {
        return this.elements.length - 1
    }
    get widthEl() {
        return this.slider.firstElementChild.offsetWidth + parseFloat(getComputedStyle(this.slider.firstElementChild).getPropertyValue('margin-right'))
    }
    #drag(e) {
        e.cancelable && e.preventDefault()
        this.state = true
        this.#params.mouseDown = e.clientX ?? e.touches[0].clientX
        this.slider.style.transition = "none"
    }
    #move(e) {
        if (!this.state) return
  
        const move = this.#params.mouseDown - (e.clientX ?? e.touches[0].clientX)
        const lastDrag = this.#params.endDrag + move
        this.#params.index = Math.round(lastDrag / this.widthEl)

        if (this.#params.index <= 0) {
            this.#params.index = 0
        } else if (this.#params.index >= this.length) {
            this.#params.index = this.length
        }
        const clamp = Math.max(0, Math.min(lastDrag, (this.widthEl * this.length)))

        this.slider.style.transform = `translate3d(${clamp * -1}px, 0, 0)`

        this.indicator.textContent = `${this.#params.index + 1} / ${this.elements.length}`

    }
    #mouseUp() {
        document.querySelector('.active')?.classList.remove('active')
        this.state = false
        this.#animation("0.5s")
        document.querySelectorAll('.element')[this.#params.index].classList.add('active')
    }
    #onResize(){
        this.#animation("none")
    }
    #increment(index){
        index
        this.#animation("0.5s")
        this.indicator.textContent = `${this.#params.index + 1} / ${this.elements.length}`
    }
    #animation(transition){
        this.slider.style.transition = transition
        this.slider.style.transform = "translate3d(" + (this.elements[this.#params.index].offsetLeft * -1) + "px, 0, 0)"
        this.#params.endDrag = this.elements[this.#params.index].offsetLeft
    }
    #next(){
        if(this.#params.index == this.length) return
        this.#increment(this.#params.index++)
    }
    #prev(){
        if(this.#params.index == 0) return
        this.#increment(this.#params.index--)
    }
    #event() {
        this.slider.addEventListener('mousedown', this.#drag.bind(this))
        document.addEventListener('mousemove', this.#move.bind(this))
        this.slider.addEventListener('mouseup', this.#mouseUp.bind(this))
        this.slider.addEventListener('touchstart', this.#drag.bind(this))
        document.addEventListener('touchmove', this.#move.bind(this))
        this.slider.addEventListener('touchend', this.#mouseUp.bind(this))
        this.btnNext.addEventListener('click', this.#next.bind(this))
        this.btnPrev.addEventListener('click', this.#prev.bind(this))
        window.addEventListener('resize', this.#onResize.bind(this))
    }
}
new carousel({
    slider: document.querySelector('.slide'),
    elements: document.querySelectorAll('.element'),
    indicator: document.querySelector('.nbr'),
    btnNext : document.querySelector('.next'),
    btnPrev : document.querySelector('.prev')
})
