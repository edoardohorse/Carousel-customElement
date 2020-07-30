class Carousel extends HTMLElement{

    static get observedAttributes(){
        return ['title', 'subtitle', 'header-position', 'header-above', 'size', 'width', 'height', 'drag']
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
        this.root.header    = document.createElement('header')  // zIndex: 10
        this.root.wrapper   = document.createElement('main')    // zIndex: 5
        this.root.footer    = document.createElement('footer')  // zIndex: 15
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
            this._index             = 0
            this._offset            = 100 
            this._nImg              = this.root.querySelectorAll('div').length
            this._isTransitioning   = false
            this._isDraggable       = false
            this._isDragging        = false
            this._commitDrag        = false
            this._events            = new Map()
            this._eventsDrag        = {
                onDragStart : e=>{
                    if(e.target != this.root.footer)
                        return e.preventDefault()
            
                    this._isDragging = true
                    this._dragStartX = e.clientX
                    this._dragStartPercentage = -this._index * this._offset
                    this._commitDrag = false
                    // debugger
                    this.root.wrapper.classList.add('dragged')
                    // log(`Mouse down: ${e.clientX}`)
                },
                
                onDragging : e=>{
                    if(!this._isDragging)
                        return e.preventDefault()
                    
                    this._isDragging = true
                    this._dragOffsetX = e.clientX - this._dragStartX
            
                    // ← goPrev
                    if(this._dragOffsetX > 0){
                        // esco se sono alla prima img
                        if(this._index == 0) return
                    }
                    // → goNext
                    else{
                        // esco se sono all'ultima
                        if(this._index == this._nImg-1) return                
                    }
                    
                    
                    
                    // Misuro l'offset dal primo tocco in percentuale alla larghezza dell'elemento
                    const offsetPercentage = this._dragOffsetX * 100/this.clientWidth
                    // sommo a questo lo stato attuale del carousel
                    const offsetPercentageRelative =  offsetPercentage + this._dragStartPercentage
                                
                    this.root.wrapper.style.transform = `translateX(${offsetPercentageRelative}%)`
                    
                    // Confermo il drag se uguale/maggiore del 50%
                    if(Math.abs(offsetPercentage) >= 50)
                        this._commitDrag = true
                    
                },

                onMouseUp : e=>{
                    if(this._isDragging){
                        
                        this._isDragging = false
                        this.root.wrapper.classList.remove('dragged')
            
                        // log('Mouse su')
            
                        if(this._commitDrag){
                            // ← goPrev
                            if(this._dragOffsetX > 0) 
                                return this.goPrev()
                            
                            this.goNext()
                        }
                        else{
                            // Ritorna alla posizione iniziale
                            this.root.wrapper.style.transform = `translateX(${this._dragStartPercentage}%)`
                        }
            
                    }
                }
            }
            
        //#endregion
        
        
    }

    connectedCallback(){
        if(this._nImg == 1){
            this.disableBtnNext()
            this.disableBtnPrev()
        }
        this.disableBtnPrev()

        this.addEventListener()
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

            case 'drag':{
                debugger
                if(newValue == "true" || newValue == "")    this.setEventListenerDrag(true)
                else if(newValue == "false")                this.setEventListenerDrag(false)
                break               
            }
        }
    }

    //#region Private
    
    addEventListener(){

        this.root.btnNext.addEventListener('click', this.goNext.bind(this), false)
        this.root.btnPrev.addEventListener('click', this.goPrev.bind(this), false)
        
        // document.addEventListener('keydown', e=>{
        //     switch(e.keyCode){
        //         case 37: this.goPrev();break;   // <-
        //         case 39: this.goNext();         // ->
                
        //     }
        // })
        
        
        this.root.footer.addEventListener('touchstart', e=>{
            log('Touchstart')
            this._touchOffsetX = 0
            this._touchStartX = e.touches[0].pageX   
        })
        
            
        this.root.footer.addEventListener('touchmove', e=>{

                this._touchOffsetX = e.touches[0].pageX - this._touchStartX;
                
                if( Math.abs(this._touchOffsetX) < Carousel.OFFSET_TOUCH_X ){return}

                // Vai a sinistra (scroll sinistra -> destra)
                if(this._touchOffsetX >= 0){              
                    // hijacked
                    this.goPrev()                
                    return
                }
                // Altrimenti vai a destra (scroll sinistra <- destra)
                this.goNext()

        })
        

        this.root.wrapper.addEventListener('transitionend', _=>{
            this._isTransitioning = false
            console.debug('Transizione finita!')
        })
        
    }
    

    setEventListenerDrag(add = true){
        
        if(add === true){
            this.root.footer.addEventListener('mousedown',    this._eventsDrag.onDragStart)
            this.root.footer.addEventListener('mousemove',    this._eventsDrag.onDragging)
            this.root.footer.addEventListener('mouseup',      this._eventsDrag.onMouseUp)
            this.root.footer.addEventListener('mouseleave',   this._eventsDrag.onMouseUp)
        }
        else if(add === false){
            this.root.footer.removeEventListener('mousedown',    this._eventsDrag.onDragStart)
            this.root.footer.removeEventListener('mousemove',    this._eventsDrag.onDragging)
            this.root.footer.removeEventListener('mouseup',      this._eventsDrag.onMouseUp)
            this.root.footer.removeEventListener('mouseleave',   this._eventsDrag.onMouseUp)
        }
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

customElements.define('custom-carousel', Carousel)