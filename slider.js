class Carousel extends HTMLElement{

    static get observedAttributes(){
        return ['title', 'subtitle', 'header-position', 'header-above', 'size', 'width', 'height']
    }

    static OFFSET_TOUCH_X   = 100
    static SIZES            = ['big','medium','small']

    get index(){return this._index+1}
    get nImg(){return this._nImg}
    get lastIndex(){ return this._nImg-1}

    set index(index){
        index = index-1
        if(index < 0 || index >= this._nImg) return log(`Indice ${index+1} non valido [0-${this._nImg}]`)

        if(this._isTransitioning){
            return console.debug('Transizione in corso...')
        }

        this._index = index

        if(this._index == 0){
            this.disableBtnPrev()
            this.enableBtnNext()
        }
        else if(this._index == this._nImg-1){
            this.enableBtnPrev()
            this.disableBtnNext()
        }
        else{
            this.enableBtnNext()
            this.enableBtnPrev()
        }

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
            this._isTransitioning = false
            
            
        //#endregion
        
        this.addEventListener()
    }

    connectedCallback(){
        if(this._nImg == 1){
            this.disableBtnNext()
            this.disableBtnPrev()
        }
        this.disableBtnPrev()
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

            case 'width':{
                this.style.setProperty('--size-width-custom', newValue+'px');
                break
            }
            
            case 'height':{
                this.style.setProperty('--size-height-custom', newValue+'px');
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

        
        this.root.footer.addEventListener('touchstart', e=>{

            this._touchOffsetX = 0
            this._touchStartX = e.touches[0].pageX   

        })
        
        this.root.footer.addEventListener('touchmove', e=>{
            
            this._touchOffsetX = e.touches[0].pageX - this._touchStartX;
            

            if( Math.abs(this._touchOffsetX) < Carousel.OFFSET_TOUCH_X ){
                return
            }

            // Vai a sinistra (scroll sinistra -> destra)
            if(this._touchOffsetX >= 0){
                
                // hijacked
                this.goPrev()
                
                return
            }

            // Altrimenti vai a destra (scroll sinistra <- destra)
            this.goNext()

        })
        
        // this.root.wrapper.addEventListener('transitionstart', _=>{
        //     this._isTransitioning = true
        // })
        
        this.root.wrapper.addEventListener('transitionend', _=>{
            this._isTransitioning = false
            console.debug('Transizione finita!')
        })
    }
      
    updateTranslate(){
        this._isTransitioning = true
        this.root.wrapper.style.transform = `translateX(-${this._index * this._offset}%)`
    }

    enableBtnPrev(){this.root.btnPrev.disabled = false}
    disableBtnPrev(){this.root.btnPrev.disabled = true}
    
    enableBtnNext(){this.root.btnNext.disabled = false}
    disableBtnNext(){this.root.btnNext.disabled = true}

    //#endregion

    //#region Methods

    goNext(){
        this.index++
    }
     
    goPrev(){
        this.index--
    }

    //#endregion
}

customElements.define('labycar-carousel', Carousel)