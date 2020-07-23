class Carousel{
    get index(){return this._index+1}
    get nImg(){return this._nImg}
    get lastIndex(){ return this._nImg-1}

    set index(index){
        index = index-1
        if(index < 0 && index >= this._nImg){
            return console.log('Indice non valido')
        }

        this._index = index
        this.updateTranslate() 
    }

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
        
        // L'indice parte da 0. Ma per l'utente parte da 1
        this._index     = 0
        this._offset    = 100 
        this._nImg      = this.el.querySelectorAll('img').length

        this.updateTranslate = () =>{ this.wrapper.style.transform = `translateX(-${this._index * this._offset}%)`}

        this.addEventListener()
    }

    addEventListener(){
        this.btnNext.addEventListener('click', this.goNext.bind(this))
        this.btnPrev.addEventListener('click', this.goPrev.bind(this))
    }


    goNext(){
        if(this._index == this._nImg-1){
            console.log('Foto terminate!')
            return
        }
        this._index++
        
        this.updateTranslate()
        console.log('Vai a destra')
    }
    
    
    goPrev(){
        if(this._index == 0 ){
            console.log('Non puoi tornare indietro')
            return
        }
        this._index--
        this.updateTranslate()
        console.log('Vai a sinistra')
    }
}