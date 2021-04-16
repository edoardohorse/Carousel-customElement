'use strict';
class Carousel extends HTMLElement{

    static get observedAttributes(){
        return ['title', 'subtitle', 'header-position', 'header-above', 'size', 'width', 'height', 'drag', 'loop', 'progression']
    }

    static get OFFSET_TOUCH_X(){return 100}
    static get ATTR_HEADER_POSITION(){return new Set(['top', 'bottom'])}   // TODO settare il valore di default
    static get ATTR_HEADER_ABOVE   (){return new Set(['true', 'false'])}   // TODO settare il valore di default
    static get ATTR_SIZE           (){return new Set(['big','medium','small'])}
    static get ATTR_DRAG           (){return new Set(['true', 'false', ''])}
    static get ATTR_LOOP           (){return new Set(['true', 'false', ''])}
    static get ATTR_PROGRESSION    (){return new Set(['true', 'false', ''])}

    get title(){ return this.getAttribute("title")}
    set title(v){ v == ""? this.removeAttribute("title"): this.setAttribute("title", v)}
    
    get subtitle(){ return this.getAttribute("subtitle")}
    set subtitle(v){ v == ""? this.removeAttribute("subtitle"): this.setAttribute("subtitle", v)}

    get headerPosition(){ return this.getAttribute("header-position")}
    set headerPosition(v){this.setAttribute("header-position", v)}
    
    get headerAbove(){ return this.getAttribute("header-above")}
    set headerAbove(v){this.setAttribute("header-above", v)}
    
    get size(){ return this.getAttribute("size")}
    set size(v){this.setAttribute("size", v)}

    get width(){ return this.getAttribute("width")}
    set width(v){ this.setAttribute("width", v)}
    
    get height(){ return this.getAttribute("height")}
    set height(v){ this.setAttribute("height", v)}

    get drag(){ return this.getAttribute("drag")}
    set drag(v){ this.setAttribute("drag", v)}
    
    get loop(){ return this.getAttribute("loop")}
    set loop(v){ this.setAttribute("loop", v)}
    
    get progression(){ return this.getAttribute("progression")}
    set progression(v){ this.setAttribute("progression", v)}
     
    get index(){return this._index+1}
    get nImg(){return this._nImg}
    get lastIndex(){ return this._nImg-1}

    set index(index){
        index = index-1

        if(this._isLooped)
            if      ( index < 0 )           index = this._nImg-1
            else if ( index > this._nImg-1) index = 0
        else
            if(index < 0 || index >= this._nImg) return log(`Indice ${index+1} non valido [0-${this._nImg}]`)


        if(this._isTransitioning){
            return console.debug('Transitioning...', this.root)
        }


        this._index = index

        if(this._index == 0 && !this._isLooped){
            this.disableBtnPrev()
            this.enableBtnNext()
        }
        else if(this._index == this._nImg-1 && !this._isLooped){
            this.enableBtnPrev()
            this.disableBtnNext()
        }
        else{
            this.enableBtnNext()
            this.enableBtnPrev()
        }

        this.root.progression.textContent = `${this._index+1}/${this._nImg}`

        // console.debug(`Indice ${this.index}`, this.root)
        this.updateTranslate() 
    }

    constructor(){
        super()

        //#region Root
        this.root           = this.attachShadow({mode: 'open'})
        this.root.wrapper   = document.createElement('main')    // zIndex: 5
        this.root.header    = document.createElement('header')  // zIndex: 10
        this.root.aside    = document.createElement('aside')  // zIndex: 15
        this.root.footer    = document.createElement('footer')  // zIndex: 20
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

        // aside
        this.root.btnPrev = document.createElement('button')
        this.root.btnPrev.textContent = `<`
        this.root.btnNext = document.createElement('button')
        this.root.btnNext.textContent = `>`

        this.root.aside.appendChild(this.root.btnPrev)
        this.root.aside.appendChild(this.root.btnNext)

        // footer
        

        //images
        let imgs = this.querySelectorAll('img')
        imgs.forEach(img=>{

            
            let div = document.createElement('div')
            div.setAttribute('data-src', img.src.replace(location.href, "./"))                
            this.root.wrapper.appendChild(div)

            div.style.backgroundImage = `url(${img.src.replace(location.href, "./")})`
            
            this.removeChild(img)
        })

        //progression
        this.root.progression     = document.createElement('span')
        

        this.root.appendChild(this.root.header)
        this.root.appendChild(this.root.wrapper)
        this.root.appendChild(this.root.aside)
        this.root.appendChild(this.root.footer)
        this.root.footer.appendChild(this.root.progression)

        //#endregion

        //#region Fields         
        
            // L'indice parte da 0. Ma per l'utente parte da 1
            this._index             = 0
            this._offset            = 100
            this._nImg              = this.root.wrapper.childElementCount
            this._imgList           = imgs
            this._isLooped          = false
            this._isTransitioning   = false
            this._isDraggable       = false
            this._isDragging        = false
            this._commitDrag        = false
            this._eventsDrag        = {
                onDragStart : e=>{
                    // debugger
                    if(e.target != this.root.aside)
                        return e.preventDefault()
                    
                    this._isTransitioning = false
                    this._isDragging = true
                    this._dragStartX = e.clientX
                    this._dragStartPercentage = -this._index * this._offset
                    this._commitDrag = false
                    // debugger
                    this.root.wrapper.classList.add('dragged')
                    // log(`Mouse down: ${e.clientX}`)
                },
                
                onDragging : e=>{
                    if(!this._isDragging || this._isTransitioning)
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
                    
                    
                    // debugger
                    // Calculate the offset from first touch as a percetange of element's width
                    const offsetPercentage = this._dragOffsetX * 100/this.clientWidth
                    // sum percentage to the actual state of carousel
                    const offsetPercentageRelative =  offsetPercentage + this._dragStartPercentage
                    // console.debug(offsetPercentage, this.root)
                    this.root.wrapper.style.transform = `translateX(${offsetPercentageRelative}%)`
                    
                    // Conferm drag if equal/more then 30%
                    if(Math.abs(offsetPercentage) >= 30)
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

        if(!this._isLooped)
            this.disableBtnPrev()

        this.root.progression.textContent = `${this._index+1}/${this._nImg}`

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

            case 'header-position':{
                if(!Carousel.ATTR_HEADER_POSITION.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_HEADER_POSITION)
                break
            }

            case 'header-above':{
                if(!Carousel.ATTR_HEADER_ABOVE.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_HEADER_ABOVE)
                break
            }
            
            case 'size':{
                if(!Carousel.ATTR_SIZE.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_SIZE)
                else{
                    this.removeAttribute('width')
                    this.removeAttribute('height')
                }
                break
            }

            case 'width':{
                if(newValue)
                    this.style.setProperty('--carousel-size-width-custom', newValue+'px');
                else
                    this.style.removeProperty('--carousel-size-width-custom')

                break
            }
            
            case 'height':{
                if(newValue)
                    this.style.setProperty('--carousel-size-height-custom', newValue+'px');
                else
                    this.style.removeProperty('--carousel-size-height-custom')
                break
            }

            case 'drag':{
                if(!Carousel.ATTR_DRAG.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_DRAG)

                if(newValue == "true" || newValue == "")    this.setEventListenerDrag(true)
                else if(newValue == "false")                this.setEventListenerDrag(false)
                break               
            }
            
            case 'loop':{
                if(!Carousel.ATTR_LOOP.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_LOOP)

                if(newValue == "true" || newValue == ""){
                    this._isLooped = true;
                    
                    this.enableBtnsNextPrev();
                }
                else if(newValue == "false"){
                    this._isLooped = false
                    
                    if(this._index == 0)            { this.disableBtnPrev(); break;}
                    if(this._index == this._nImg-1) { this.disableBtnNext(); break;}
                }
                
                break               
            }

            case 'progression':{
                if(!Carousel.ATTR_PROGRESSION.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_PROGRESSION)

                if(newValue == "true" || newValue == ""){
                    this.root.progression.style.visibility = 'visible'
                }
                else if(newValue == "false"){
                    this.root.progression.style.visibility = 'hidden'
                }


                break;
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

        
        this.root.aside.addEventListener('touchstart', e=>{
            this._eventsDrag.onDragStart(e.touches[0])
        })
        this.root.aside.addEventListener('touchmove', e=>{
            this._eventsDrag.onDragging(e.touches[0])
        })

        this.root.aside.addEventListener('touchend', e=>{
            this._eventsDrag.onMouseUp(e.touches[0])
        })
        
        this.root.wrapper.addEventListener('transitionend', _=>{
            this._isTransitioning = false
            console.debug('Transition done!', this.root)
        })
 
    }
    

    setEventListenerDrag(add = true){
        
        if(add === true){
            this.root.aside.addEventListener('mousedown',    this._eventsDrag.onDragStart)
            this.root.aside.addEventListener('mousemove',    this._eventsDrag.onDragging)
            this.root.aside.addEventListener('mouseup',      this._eventsDrag.onMouseUp)
            this.root.aside.addEventListener('mouseleave',   this._eventsDrag.onMouseUp)
        }
        else if(add === false){
            this.root.aside.removeEventListener('mousedown',    this._eventsDrag.onDragStart)
            this.root.aside.removeEventListener('mousemove',    this._eventsDrag.onDragging)
            this.root.aside.removeEventListener('mouseup',      this._eventsDrag.onMouseUp)
            this.root.aside.removeEventListener('mouseleave',   this._eventsDrag.onMouseUp)
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

    enableBtnsNextPrev(){ this.enableBtnNext(); this.enableBtnPrev();}

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


class CarouselDottedBar extends Carousel{
    static get observedAttributes(){
        return Carousel.observedAttributes
    }

    get index(){return super.index}
    set index(index){
        super.index = index

        this.selectDot( this._dotList[this._index] )
    }

    constructor(){
        super()
        
        this._dotList = []
        this._dotSelected = undefined

        let wrapperDot = document.createElement('div')
        
        let indexDot = 1 
        this._imgList.forEach(img=>{

            let dot = document.createElement('ol')        
            dot.addEventListener('click', function(ol, index){
                // debugger
                this.index = index
                this.selectDot(ol)

            }.bind(this, dot, indexDot))

            wrapperDot.appendChild(dot)
            this._dotList.push(dot)
            indexDot++
        })

        this.root.footer.classList.add('extendable')
        
        this.root.footer.appendChild(wrapperDot)
    }


    connectedCallback(){
        super.connectedCallback()

        this._dotSelected = this._dotList[this._index]
        this.selectDot( this._dotSelected )
    }

    attributeChangedCallback(name, oldValue, newValue) { 
        super.attributeChangedCallback(name, oldValue, newValue)
    }

    //#region Private
    selectDot(dot){

        this._dotSelected.classList.remove('selected')
        this._dotSelected = dot
        this._dotSelected.classList.add('selected')

    }

    //#endregion

}

class CarouselPreviewBar extends Carousel{
    static get observedAttributes(){
        return Carousel.observedAttributes
    }

    get index(){return super.index}
    set index(index){
        super.index = index

        this.root.progression.textContent = `${this._index+1}/${this._nImg}`

        this.selectPreview( this._previewList[this._index] )
    }

    constructor(){
        super()

        //#region Fields

            this._previewList           = []
            this._splitPreviews         = []
            this._nPreviewPerSplit      = undefined
            this._offsetPreview         = 0
            this._indexSplitPreview     = 0

        //#endregion

        //#region Root
        
            this.root.btnNextPreview = this.root.btnNext.cloneNode(true)        
            this.root.btnPrevPreview = this.root.btnPrev.cloneNode(true)        

            this.root.wrapperPreviews = document.createElement('main')

            
            let indexPreview = 1 
            this._imgList.forEach(img=>{

                let imgEl = document.createElement('div')        
                imgEl.classList.add('preview')

                imgEl.style.backgroundImage = `url(${img.src.replace(location.href, "./")})`

                imgEl.addEventListener('click', function(el, index){
                    // debugger
                    this.index = index
                    this.selectPreview(el)

                }.bind(this, imgEl, indexPreview))

                this.root.wrapperPreviews.appendChild(imgEl)
                this._previewList.push(imgEl)
                indexPreview++
            })
                  
            
            this.root.footer.classList.add('extendable')

            this.root.footer.appendChild(this.root.wrapperPreviews)
            this.root.footer.appendChild(this.root.btnPrevPreview)
            this.root.footer.appendChild(this.root.btnNextPreview)

        //#endregion
    }


    connectedCallback(){
        super.connectedCallback()

        this._previewSelected = this._previewList[this._index]
        this.selectPreview( this._previewSelected )

        // ensure that after the object is places into the DOM,
        // the split are calculated on TRUE sizes of div.preview
        setTimeout(this.calculateSplitPreview.bind(this),50)

        this.root.addEventListener('onresize', this.calculateSplitPreview.bind(this))
    }

    attributeChangedCallback(name, oldValue, newValue) { 
        super.attributeChangedCallback(name, oldValue, newValue)
        
        // if any of these attributes change, recalculate the splits
        if(['size','width','height'].includes(name)){
            this.calculateSplitPreview()
        }
    }


    //#region Private
    addEventListener(){
        super.addEventListener()

        this.root.btnPrevPreview.addEventListener('click', this.goPrevPreview.bind(this))
        this.root.btnNextPreview.addEventListener('click', this.goNextPreview.bind(this))
    }

    selectPreview(preview){

        this._previewSelected.classList.remove('selected')
        this._previewSelected = preview
        this._previewSelected.classList.add('selected')

    }

    updateTranslate(){
        super.updateTranslate()
        
        this._offsetPreview = this._splitPreviews[this._index]
        
        this._indexSplitPreview = this._index

        this.root.wrapperPreviews.style.transform = `translateX(-${ this._offsetPreview }px)`
    }

    calculateSplitPreview(){
        console.debug('Calculeted split preview', this.root)
        this._splitPreviews                              = []
        // debugger
        const widthImg                                  = this._previewList[0].offsetWidth  // 75

                                                        // (595 - (75 * 7) ) / 7 => 10px [5px marginLeft + 5px marginRight]
        const offsetMarginPreview                       = (this.root.wrapperPreviews.clientWidth - ( widthImg* this._nImg) ) / this._nImg 
       
                                                        //  350 - 50 [width btnPrevPreview + width btnNextPreview]) / ( 75 + 10 )  => 3,529..
        const nPreviewVisiblePerSplit                   = (this.root.footer.clientWidth - (this.root.btnNextPreview.clientWidth + this.root.btnPrevPreview.clientWidth) ) / 
                                                            (widthImg + offsetMarginPreview)

                                                        // (4 [3,529.. => 4] - 3.529..) * 75 => 35.29... [px remaining to last img to be showed entirely]
                                                        // 3 img showed entirely + 39.705px [75px - 35.29px] of next img 
        const deviationPixelToNextPreviewOfNextSplit    = (Math.ceil(nPreviewVisiblePerSplit) - nPreviewVisiblePerSplit) * widthImg

                                                        // 3,526.. => 3
        this._nPreviewPerSplit                          = Math.floor(nPreviewVisiblePerSplit)
        
        
        /*[0, 0, 0,      255, 255, 255,     375.29411764705884, 375.29411764705884]*/
        // ↑ 1° split     ↑ 2° split                        ↑ 3° split
        //    0px        (75px + 10px) * 3       255px + 35.29px  + (75px + 10px) * (2 - 1)
        //           [preview per split] ↑       [deviation] ↑                         ↑
        //           [n preview of last split less the one showed thanks to deviation] ↑
        for(let i = 0; i < this._nImg; i+=this._nPreviewPerSplit){
            // per each split index set the offset to left
            let slice = this._previewList.slice(i, i+this._nPreviewPerSplit).map(
                            x=>{return this._previewList[i].offsetLeft - (offsetMarginPreview/2)}
                            )
            
            // if it's last split, calculate how many pixel remains to show last preview
            // in such a way that wrapperPreview it's aligned [0px distance] to btnNextPreview
            if( i+this._nPreviewPerSplit >= this._nImg){
                
                let lastSplit = 
                    this._splitPreviews[this._splitPreviews.length-1] + deviationPixelToNextPreviewOfNextSplit +
                        ((widthImg + offsetMarginPreview) * (slice.length-1))

                for( let lastIndex in slice)
                    slice[lastIndex] = lastSplit
            }

            this._splitPreviews = this._splitPreviews.concat(slice)
        }
    }

    //#endregion

    //#region Methods

    goPrevPreview(){
        if(this._indexSplitPreview == 0 )
            this._indexSplitPreview = this._splitPreviews.length-1
        else
            this._indexSplitPreview -= this._nPreviewPerSplit
        
        this._offsetPreview = this._splitPreviews[this._indexSplitPreview]
        
        this.root.wrapperPreviews.style.transform = `translateX(-${ this._offsetPreview }px)`
    }

    goNextPreview(){
        
        if(this._indexSplitPreview + this._nPreviewPerSplit >= this._splitPreviews.length)
            this._indexSplitPreview = 0
        else
            this._indexSplitPreview += this._nPreviewPerSplit
        
        this._offsetPreview = this._splitPreviews[this._indexSplitPreview]

        this.root.wrapperPreviews.style.transform = `translateX(-${ this._offsetPreview }px)`
    }
    
    //#endregion

    

}


    
customElements.define('custom-carousel', Carousel)
customElements.define('carousel-dottedbar', CarouselDottedBar)
customElements.define('carousel-previewbar', CarouselPreviewBar)