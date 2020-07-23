class Carousel{
    get index(){return this._index+1}
    get nImg(){return this._nImg}
    get lastIndex(){ return this._nImg-1}

    get title(){return this.root.getAttribute('title')}
    set title(v){
        this.root.setAttribute('title', v);
        this.root.titleEl.textContent = v
    }

    static HEADER_POSITION = ['top','bottom'] 

    get headerPosition(){
        if(this.root.hasAttribute('header-position'))
            return this.root.getAttribute('header-position')
        
        // Default
        return 'top'
    }

    set headerPosition(v){
        if(v in HEADER_POSITION){
            return this.root.setAttribute('header-position', v)
        }
        return console.error('Valore %c non inesistente. Usare %c', v, HEADER_POSITION)
    }

    get headerAbove(){
        if(this.root.hasAttribute('header-above')){
            return this.root.getAttribute('header-above')
        }
    }

    set headerAbove(v){
        if(v in [true,false]){
            this.root.setAttribute('header-above', v)
        }

    }

    set index(index){
        index = index-1
        if(index < 0 && index >= this._nImg){
            return console.log('Indice non valido')
        }

        this._index = index
        this.updateTranslate() 
    }

    constructor(el){

        //#region Root
        this.root           = el
        this.root.header    = el.querySelector('header')
        this.root.wrapper   = el.querySelector('main')
        this.root.footer    = el.querySelector('footer')

        // header
        this.root.titleEl = document.createElement('p')
        this.root.titleEl.textContent = this.root.getAttribute('title')
        
        this.root.subtitleEl = document.createElement('p')
        this.root.subtitleEl.textContent = this.root.getAttribute('subtitle')

        this.root.header.appendChild(this.root.titleEl)
        this.root.header.appendChild(this.root.subtitleEl)

        // footer
        this.root.btnPrev = document.createElement('button')
        this.root.btnPrev.textContent = `<`
        this.root.btnNext = document.createElement('button')
        this.root.btnNext.textContent = `>`

        this.root.footer.appendChild(this.root.btnPrev)
        this.root.footer.appendChild(this.root.btnNext)

        //#endregion

        //#region Fields         
        
            // L'indice parte da 0. Ma per l'utente parte da 1
            this._index     = 0
            this._offset    = 100 
            this._nImg      = this.root.querySelectorAll('div').length
            
        //#endregion
        
        this.addEventListener()
    }

    //#region Private
    
    addEventListener(){
        this.root.btnNext.addEventListener('click', this.goNext.bind(this))
        this.root.btnPrev.addEventListener('click', this.goPrev.bind(this))
        
        document.addEventListener('keydown', e=>{
            switch(e.keyCode){
                case 37: this.goPrev();break;   // <-
                case 39: this.goNext();         // ->
                
            }
        })
    }
      
    updateTranslate(){
        this.wrapper.style.transform = `translateX(-${this._index * this._offset}%)`
    }

    //#endregion

    //#region Methods

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

    //#endregion
}