class Carousel extends HTMLElement{

    static get observedAttributes(){
        return ['title', 'subtitle', 'header-position', 'header-above']
    }

    get index(){return this._index+1}
    get nImg(){return this._nImg}
    get lastIndex(){ return this._nImg-1}

    set index(index){
        index = index-1
        if(index < 0 && index >= this._nImg){
            return console.debug('Indice non valido')
        }

        this._index = index
        this.updateTranslate() 
    }

    constructor(el){
        super()

        //#region Root
        this.root           = this.attachShadow({mode: 'open'})
        this.root.header    = document.createElement('header')
        this.root.wrapper   = document.createElement('main')
        this.root.footer    = document.createElement('footer')
        this.root.style     = document.createElement('link')

        //style
        this.root.style.setAttribute('rel','stylesheet')
        this.root.style.setAttribute('href','slider.css')

        this.root.appendChild(this.root.style)

        // header
        this.root.titleEl = document.createElement('span')
        this.root.titleEl.textContent = this.getAttribute('title')
        
        this.root.subtitleEl = document.createElement('span')
        this.root.subtitleEl.textContent = this.getAttribute('subtitle')

        this.root.header.appendChild(this.root.titleEl)
        this.root.header.appendChild(this.root.subtitleEl)

        // footer
        this.root.btnPrev = document.createElement('button')
        this.root.btnPrev.textContent = `<`
        this.root.btnNext = document.createElement('button')
        this.root.btnNext.textContent = `>`

        this.root.footer.appendChild(this.root.btnPrev)
        this.root.footer.appendChild(this.root.btnNext)

        //images
        this.querySelectorAll('div').forEach(div=>{

            this.removeChild(div)
            this.root.wrapper.appendChild(div)
            div.style.backgroundImage= `url(${div.dataset.src})`

        })

        this.root.appendChild(this.root.header)
        this.root.appendChild(this.root.wrapper)
        this.root.appendChild(this.root.footer)

        //#endregion

        //#region Fields         
        
            // L'indice parte da 0. Ma per l'utente parte da 1
            this._index     = 0
            this._offset    = 100 
            this._nImg      = this.root.querySelectorAll('div').length
            
        //#endregion
        
        this.addEventListener()
    }

    connectedCallback(){

    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case 'title':{
                this.root.titleEl.textContent = newValue
                break
            }
            
            case 'subtitle':{
                this.root.subtitleEl.textContent = newValue
                break
            }

        }
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
        this.root.wrapper.style.transform = `translateX(-${this._index * this._offset}%)`
    }

    //#endregion

    //#region Methods

    goNext(){
        if(this._index == this._nImg-1){
            console.debug('Foto terminate!')
            return
        }
        this._index++
        
        this.updateTranslate()
        console.debug('Vai a destra')
    }
     
    goPrev(){
        if(this._index == 0 ){
            console.debug('Non puoi tornare indietro')
            return
        }
        this._index--
        this.updateTranslate()
        console.debug('Vai a sinistra')
    }

    //#endregion
}

customElements.define('labycar-carousel', Carousel)