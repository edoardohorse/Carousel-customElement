class Carousel{

    get nImg(){return this._nImg}
    get lastIndex(){ return this._nImg-1}

    constructor(el){

        // this.el = document.createElement('div')
        // this.el.classList.add('wrapper')
        this.el         = el
        this.header     = el.querySelector('header')
        this.wrapper    = el.querySelector('main')
        this.footer     = el.querySelector('footer')

        this.btnPrev = document.createElement('button')
        this.btnPrev.textContent = `<`
        this.btnNext = document.createElement('button')
        this.btnNext.textContent = `>`

        this.footer.appendChild(this.btnPrev)
        this.footer.appendChild(this.btnNext)

        // el.appendChild(this.el)
        
        this._index     = 0
        this._offset    = 100 
        this._nImg      = this.el.querySelectorAll('img').length

        this.addEventListener()
    }

    addEventListener(){
        this.btnNext.addEventListener('click', this.goNext.bind(this))
        this.btnPrev.addEventListener('click', this.goPrev.bind(this))
    }

    goTo(index){//TODO
    }

    goNext(){
        if(this._index == this._nImg-1){
            console.log('Foto terminate!')
            return
        }
        this._index++
        this.wrapper.style.transform = `translateX(-${this._index * this._offset}%)`
        
        console.log('Vai a destra')
    }
    
    
    goPrev(){
        if(this._index == 0 ){
            console.log('Non puoi tornare indietro')
            return
        }
        this._index--
        this.wrapper.style.transform = `translateX(-${this._index * this._offset}%)`
        console.log('Vai a sinistra')
    }
}