class carousel {
    #slider
    #elements
    #indicator
    #params = {
        mouseDown: 0,
        dragX: 0,
        endDrag: 0,
        index: 0
    }
    constructor({ slider, elements, indicator }) {
        this.#slider = slider
        this.#elements = elements
        this.#indicator = indicator
        this.state = false
        this.#onLoad()
    }
    get length() {
        return this.#elements.length - 1
    }
    get widthEl() {
        return this.#slider.firstElementChild.offsetWidth + parseFloat(getComputedStyle(this.#slider.firstElementChild).getPropertyValue('margin-right'))
    }
    #onLoad() {
        this.#indicator.textContent = `${this.#params.index + 1} / ${this.#elements.length}`
        this.#event()
    }
    #drag(e) {
        e.cancelable && e.preventDefault()
        this.state = true
        this.#params.mouseDown = e.clientX ?? e.touches[0].clientX
        this.#slider.style.transition = "none"
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

        this.#slider.style.transform = "translateX(" + (clamp * -1) + "px)"

        this.#indicator.textContent = `${this.#params.index + 1} / ${this.#elements.length}`
    }
    #mouseUp() {
        this.state = false

        this.#slider.style.transform = "translateX(-" + this.#elements[this.#params.index].offsetLeft + "px)"
        this.#slider.style.transition = "0.5s"

        this.#params.endDrag = this.#elements[this.#params.index].offsetLeft
    }
    #event() {
        this.#slider.addEventListener('mousedown', this.#drag.bind(this))
        document.addEventListener('mousemove', this.#move.bind(this))
        this.#slider.addEventListener('mouseup', this.#mouseUp.bind(this))
        this.#slider.addEventListener('touchstart', this.#drag.bind(this))
        document.addEventListener('touchmove', this.#move.bind(this))
        this.#slider.addEventListener('touchend', this.#mouseUp.bind(this))
    }
}
new carousel({
    slider: document.querySelector('.slide'),
    elements: document.querySelectorAll('.element'),
    indicator: document.querySelector('.nbr')
})
