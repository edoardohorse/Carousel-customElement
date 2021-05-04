'use strict';

const OPTIONS_OBSERVER_CAROUSEL =  {
    root: null,
    rootMargin: '0px',
    threshold: .4
}

const observerCarousel = new IntersectionObserver( function(entries, observerCarousel){
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.shown = true
            else                     entry.target.shown = false
        })
    }
    , OPTIONS_OBSERVER_CAROUSEL);

class Carousel extends HTMLElement{

    static get observedAttributes(){
        return ['title', 'subtitle', 'header-position', 'header-above', 'size', 'size-img',
                'width', 'height', 'drag', 'loop', 'progression', 'fullscreen', 'timer']
    }

    static get OFFSET_TOUCH_X(){return 100}
    static get ATTR_HEADER_POSITION(){return new Set(['top', 'bottom', ''])}
    static get ATTR_HEADER_ABOVE   (){return new Set(['true', 'false', ''])}
    static get ATTR_SIZE           (){return new Set(['big','medium','small'])}
    static get ATTR_DRAG           (){return new Set(['true', 'false', ''])}
    static get ATTR_LOOP           (){return new Set(['true', 'false', ''])}
    static get ATTR_PROGRESSION    (){return new Set(['true', 'false', ''])}
    static get ATTR_FULLSCREEN     (){return new Set(['opened', 'closed',''])}
    static get ATTR_SIZE_IMG       (){return new Set(['fill', 'contain', 'cover','none','scale-down',''])}

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
    
    get fullscreen(){ return this.getAttribute("fullscreen")}
    set fullscreen(v){ this.setAttribute("fullscreen", v)}

    get timer(){ return this.getAttribute("timer")}
    set timer(v){ v == ""? this.removeAttribute("timer"): this.setAttribute("timer", v)}
    
    get sizeImg(){ return this.getAttribute("size-img")}
    set sizeImg(v){ this.setAttribute("size-img", v)}

    get shown(){return this._isShown}
    set shown(v){
        if(v) this.play()
        else  this.pause()

        this._isShown = v
    }
     
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
        this.root               = this.attachShadow({mode: 'open'})
        this.root.wrapper       = document.createElement('main')    // zIndex: 5
        this.root.header        = document.createElement('header')  // zIndex: 10
        this.root.aside         = document.createElement('aside')   // zIndex: 15
        this.root.footer        = document.createElement('footer')  // zIndex: 20
        this.root.controls      = document.createElement('div')       //zIndex:  30
        this.root.fullscreenEl  = document.createElement('i')       
        this.root.timerEl       = document.createElement('i')       
        this.root.sizeImgEl     = document.createElement('i')       
        this.root.style         = document.createElement('link')
        this.root.styleFullscreen= document.createElement('link')

        // controls
        this.root.controls.id       = 'controls'
        this.root.fullscreenEl.id   = 'fullscreen'
        this.root.timerEl.id        = 'timer'
        this.root.sizeImgEl.id      = 'sizeImg'
        this.root.controls.appendChild(this.root.sizeImgEl)
        this.root.controls.appendChild(this.root.timerEl)
        this.root.controls.appendChild(this.root.fullscreenEl)

        //style
        this.root.style.setAttribute('rel','stylesheet')
        this.root.style.setAttribute('href','carousel.css')
        this.root.style.addEventListener('load', _=>{
            if(this._timer) observerCarousel.observe(this)
        })

        this.root.styleFullscreen.setAttribute('rel','stylesheet')
        this.root.styleFullscreen.setAttribute('href','carousel_fullscreen.css')
        this.root.styleFullscreen.disabled = true

        this.root.appendChild(this.root.style)
        this.root.appendChild(this.root.styleFullscreen)

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
        let imgs = this.querySelectorAll('img-lazy, img')
        
        imgs.forEach(img=>{
            
            if(img instanceof ImgLazy) return this.root.wrapper.appendChild(img)

            let el = document.createElement('div')
            el.setAttribute('data-src', img.src.replace(location.href, "./"))                
            
            el.style.backgroundImage = `url(${img.src.replace(location.href, "./")})`
            this.root.wrapper.appendChild(el)
            
            this.removeChild(img)
        })


        //progression
        this.root.progression     = document.createElement('span')
        

        
        this.root.appendChild(this.root.controls)
        this.root.appendChild(this.root.header)
        this.root.appendChild(this.root.wrapper)
        this.root.appendChild(this.root.aside)
        this.root.appendChild(this.root.footer)
        this.root.footer.appendChild(this.root.progression)

        //#endregion

        //#region Fields         
        
            // Index starts from 0. Though, for the user starts from 1
            this._index             = 0
            this._offset            = 100
            this._nImg              = this.root.wrapper.childElementCount
            this._imgList           = imgs
            this._timerSeconds      = 0
            this._timer             = null
            this._isShown           = false
            this._isPausedTimer     = false
            this._isLooped          = false
            this._isFullscreen      = false
            this._defaultSizeImg    = null
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
                    this._isPausedTimer = true
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
                        
                        this._isDragging    = false
                        this._isPausedTimer = false
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

            this._nextIndex = _=>{
                let next = this._index+1
                if( next > this.nImg-1)
                    return (this._isLooped? 0: this._index)
                return next
            }
            
            this._prevIndex = _=>{
                let prev = this._index-1
                if( prev < 0)
                    return (this._isLooped? this._nImg-1: 0)
                return prev
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

        this._defaultSizeImg = this.sizeImg

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
            
            case 'fullscreen':{
                if(!Carousel.ATTR_FULLSCREEN.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_FULLSCREEN)
                
                if(newValue == "opened"){
                    this.root.styleFullscreen.disabled = !(this._isFullscreen = true)
                }
                else if(newValue == "closed" || newValue == ""){
                    this.root.styleFullscreen.disabled = !(this._isFullscreen = false)
                }


                break;
            }

            case 'timer':{
                if(newValue == 'paused')
                    this.setTimer(0)    
                else
                    this.setTimer(parseInt(newValue))
                break  
            }

            case 'size-img':{
                if(!Carousel.ATTR_SIZE_IMG.has(newValue)) return console.error('Can be setted only value: ', Carousel.ATTR_SIZE_IMG)
                
                if(newValue == '') newValue = 'cover'

                this._imgList.forEach(img=>{
                    if(img instanceof HTMLImageElement) img.style.objectFit = newValue
                    else img.size = newValue
                })

                


                break
            }
        }
    }

    //#region Private
    
    addEventListener(){

        this.root.btnNext.addEventListener('click', this.goNext.bind(this), false)
        this.root.btnPrev.addEventListener('click', this.goPrev.bind(this), false)

        this.root.fullscreenEl.addEventListener('click',this.toggleFullscreen.bind(this), false)
        this.root.timerEl.addEventListener('click',     this.togglePlayback.bind(this), false)
        this.root.sizeImgEl.addEventListener('click',   this.toggleSizeImgContain.bind(this), false)
        
        // document.addEventListener('keydown', e=>{
        //     switch(e.keyCode){
        //         case 37: this.goPrev();break;   // <-
        //         case 39: this.goNext();         // ->
                
        //     }
        // })

        
        this.root.aside.addEventListener('touchstart', e=>{
            if(e.touches[0].target != this.root.aside) return 
            e.clientX = e.touches[0].clientX
            this._eventsDrag.onDragStart(e)
        })
        this.root.aside.addEventListener('touchmove', e=>{
            if(e.touches[0].target != this.root.aside) return 
            e.clientX = e.touches[0].clientX
            this._eventsDrag.onDragging(e)
        })

        this.root.aside.addEventListener('touchend', e=>{
            this._eventsDrag.onMouseUp(e)
        })

        this.root.wrapper.addEventListener('transitionstart', _=>{
            this._isTransitioning = true
            console.debug('Transition start!', this.root)
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
        this.root.wrapper.style.transform = `translateX(-${this._index * this._offset}%)`
    }

    enableBtnPrev(){this.root.btnPrev.disabled = false}
    disableBtnPrev(){this.root.btnPrev.disabled = true}
    
    enableBtnNext(){this.root.btnNext.disabled = false}
    disableBtnNext(){this.root.btnNext.disabled = true}

    enableBtnsNextPrev(){ this.enableBtnNext(); this.enableBtnPrev();}

    setTimer(seconds){
        
        clearTimeout(this._timer)
        
        if(seconds <= 0 )
            return 

        this._timerSeconds = seconds 
        seconds *= 1000

        this._timer = setInterval(_=>{
            if(!this._isPausedTimer && this._imgList[this._index].complete)
                this.goNext()
        }, seconds)
    }


    //#endregion

    //#region Methods

    goNext(){
        this.index++
    }
    
    goPrev(){
        this.index--
    }

    openFullscreen(){
        this.fullscreen = 'opened'
        this.setSizeImgContain()
        console.debug('Fullscreen opened',this.root)
    }

    closeFullscreen(){
        this.fullscreen = 'closed'
        this.sizeImg = this._defaultSizeImg
        console.debug('Fullscreen closed',this.root)
    }

    toggleFullscreen(){
        this._isFullscreen? this.closeFullscreen(): this.openFullscreen();
    }

    setSizeImgContain(){
        this.sizeImg = 'contain'
    }

    toggleSizeImgContain(){
        if(this.sizeImg == 'contain')
            this.sizeImg = this._defaultSizeImg
        else
            this.setSizeImgContain()
    }

    pause(){
        this.timer = 'paused'
        this._isPausedTimer = true
    }

    play(){
        this.timer = this._timerSeconds
        this._isPausedTimer = false
    }

    togglePlayback(){
        this._isPausedTimer? this.play(): this.pause(); 
    }
    //#endregion
}


class CarouselDotted extends Carousel{
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

class CarouselPreview extends Carousel{
    static get observedAttributes(){
        return Carousel.observedAttributes
    }

    get index(){return super.index}
    set index(index){
        super.index = index

        this.root.progression.textContent = `${this._index+1}/${this._nImg}`

        this.selectPreview( this._previewList[this._index] )
    }


    set readyToShowPreview(v){
        if(v)
            this.root.footer.classList.add('extendable')
        else
            this.root.footer.classList.remove('extendable')

        this._readyToShow = v
    }

    constructor(){
        super()

        //#region Fields

            this._previewList           = []
            this._splitPreviews         = []
            this._nPreviewPerSplit      = undefined
            this._offsetPreview         = 0
            this._indexSplitPreview     = 0
            this._readyToShow           = false

        //#endregion

        //#region Root
        
            this.root.btnNextPreview = this.root.btnNext.cloneNode(true)        
            this.root.btnPrevPreview = this.root.btnPrev.cloneNode(true)        

            this.root.wrapperPreviews = document.createElement('main')

            
            let indexPreview = 1 
            this._imgList.forEach(img=>{

                let imgEl = img.cloneNode()
                // imgEl.lazy = false
                                
                if(img instanceof ImgLazy) imgEl.size = 'cover'
                
                // imgEl.style.backgroundImage = `url(${img.src.replace(location.href, "./")})`
                
                imgEl.onload = debounce(function(){this.calculateSplitPreview()}.bind(this),500)
                
                imgEl.classList.add('preview')
                

                imgEl.addEventListener('click', function(el, index){
                    // debugger
                    this.index = index
                    this.selectPreview(el)

                }.bind(this, imgEl, indexPreview))

                this.root.wrapperPreviews.appendChild(imgEl)
                this._previewList.push(imgEl)
                indexPreview++
            })

                  

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
        this.calculateSplitPreview(50)

        window.addEventListener('resize', debounce(function(){this.calculateSplitPreview()}.bind(this),500))
    }

    attributeChangedCallback(name, oldValue, newValue) { 
        super.attributeChangedCallback(name, oldValue, newValue)
        
        // if any of these attributes change, recalculate the splits
        if(['size','width','height'].includes(name)){
            debounce(function(){this.calculateSplitPreview()}.bind(this),500)
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
        
        // debugger
        this._offsetPreview = this._splitPreviews.get(this._index).offsetToIndexSplit
        this._indexSplitPreview = this._splitPreviews.get(this._index).indexSplit

        this.root.wrapperPreviews.style.transform = `translateX(-${ this._offsetPreview }px)`
    }

    calculateSplitPreview(timer = 0){
        this.readyToShowPreview = false

        let calculate = _=>{
            // see footer extendible first, than make calculation
            this.readyToShowPreview = true

            console.group('Calculation splits', this.root)
            console.debug('Calculeted split preview')
            this._splitPreviews                              = new Map()
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

            let lastSplit = 0

           /*  if(deviationPixelToNextPreviewOfNextSplit + offsetMarginPreview > widthImg){
                debugger
            } */
            
            // if no split is needed → [0, 0, 0, 0, 0, 0, 0]
            if(this._nPreviewPerSplit >= this._nImg){

                this.hideBtnNextPrevPreviews()

                console.debug('No split needed',this.root)
                
                this._splitPreviews = new Map()
                this._previewList.slice(0, this._previewList.length).map(x=>{ 
                        this._splitPreviews.set( this._previewList.indexOf(x) ,
                                                    {   'indexSplit':0,
                                                        'offsetToIndexSplit':0
                                                    })
                                                })
                
                this._indexSplitPreview = 0
                
            }
            else{

                this.showBtnNextPrevPreviews()
            
                /*[0, 0, 0,      255, 255, 255,     375.29411764705884, 375.29411764705884]*/
                // ↑ 1° split     ↑ 2° split                        ↑ 3° split
                //    0px        (75px + 10px) * 3       255px + 35.29px  + (75px + 10px) * (2 - 1)
                //           [preview per split] ↑       [deviation] ↑                         ↑
                //           [n preview of last split less the one showed thanks to deviation] ↑
                for(let i = 0; i < this._nImg; i+=this._nPreviewPerSplit){
                    // per each split index set the offset to the left
                    // debugger
                    let slice = this._previewList.slice(i, i+this._nPreviewPerSplit).map(
                                    x=>{return this._previewList[i].offsetLeft - (offsetMarginPreview/2)}
                                    )
                    

                    // if it's last split, calculate how many pixel remains to show last preview
                    // in such a way that wrapperPreview it's aligned [0px distance] to btnNextPreview
                    if( i+this._nPreviewPerSplit >= this._nImg){
                        
                        let lastSplitOffset = 
                            this._splitPreviews.get(this._splitPreviews.size-1).offsetToIndexSplit + deviationPixelToNextPreviewOfNextSplit + offsetMarginPreview +
                            ((widthImg + offsetMarginPreview) * (slice.length-1)) 

                        for( let lastIndex in slice)
                            slice[lastIndex] = lastSplitOffset

                        lastSplit = i
                    }

                    // this._splitPreviews = this._splitPreviews.concat(slice)
                    var j = i
                    for(let offset of slice){
                        this._splitPreviews.set(j,{
                            'indexSplit': i,
                            'offsetToIndexSplit': offset
                        })
                        j++
                    }

                    
                }
            }

            this._splitPreviews.set('lastSplit', lastSplit)

            // update the position of the split selected. Useful when fullscreen mode is closed,
            // and from one split (the only needed), became more then 1 splits
            this.updateTranslate()
            console.table(Object.fromEntries(this._splitPreviews))
            console.groupEnd()
        }

        // check if there are some HTMLImageElement that are not fully loaded 
        let imgLoaded = new Set()
        this._previewList.forEach(img=>{
            if(img instanceof HTMLImageElement) imgLoaded.add(img.complete)
        })

        // if is set has at least one false, don't show previews
        if(!imgLoaded.has(false))
            setTimeout(calculate.bind(this), timer)
    }

    //#endregion

    //#region Methods

    goPrevPreview(){
        if(this._indexSplitPreview == 0 )
            this._indexSplitPreview = this._splitPreviews.get('lastSplit')
        else
            this._indexSplitPreview -= this._nPreviewPerSplit
        
        this._offsetPreview = this._splitPreviews.get(this._indexSplitPreview).offsetToIndexSplit
        
        this.root.wrapperPreviews.style.transform = `translateX(-${ this._offsetPreview }px)`
    }

    goNextPreview(){
        
        if(this._indexSplitPreview == this._splitPreviews.get('lastSplit'))
            this._indexSplitPreview = 0
        else
            this._indexSplitPreview += this._nPreviewPerSplit
        
        this._offsetPreview = this._splitPreviews.get(this._indexSplitPreview).offsetToIndexSplit

        this.root.wrapperPreviews.style.transform = `translateX(-${ this._offsetPreview }px)`
    }
    
    openFullscreen(){
        super.openFullscreen()

        this.calculateSplitPreview(100)
    }

    closeFullscreen(){
        super.closeFullscreen()

        this.calculateSplitPreview(100)
    }

    showBtnNextPrevPreviews(){ this.root.btnNextPreview.disabled = this.root.btnPrevPreview.disabled = false  }
    hideBtnNextPrevPreviews(){ this.root.btnNextPreview.disabled = this.root.btnPrevPreview.disabled = true  }


    //#endregion

    

}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


    
customElements.define('carousel-default',   Carousel)
customElements.define('carousel-dotted',    CarouselDotted)
customElements.define('carousel-preview',   CarouselPreview)