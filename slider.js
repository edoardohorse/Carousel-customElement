class Carousel{

    constructor(el){

        this.el = document.createElement('div')
        this.el.classList.add('carousel')

        this.btnPrev = document.createElement('button')
        this.btnPrev.value = `<`
        this.btnNext = document.createElement('button')
        this.btnNext.value = `>`

        this.el.appendChild(this.btnNext)
        this.el.appendChild(this.btnPrev)

        el.appendChild(this)
        
        this.addEventListener()
    }

    addEventListener(){
        this.btnNext.addEventListener('click', this.goNext.bind(this))
        this.btnPrev.addEventListener('click', this.goPrev.bind(this))
    }

    goTo(index){//TODO }

    goNext(){

    }


    goPrev(){

    }
}