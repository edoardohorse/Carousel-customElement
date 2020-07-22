class LabyCarSlider extends HTMLElement{

    constructor(){
        super()

        // console.log('Hai aggiunto un custom Element')
        this.root   = this.attachShadow({mode: 'open'})
        this.script = document.createElement("script")
        this.script.src = ''

        this.root.innerHTML  = `
            <style>
                :host{
                    font-size: 20px;
                    font-family: monospace;
                }
            </style>
        `
        this.root.innerHTML +='<p>Prova</p>'
    }

    connectedCallback(){
        this.root.appendChild(this.script)

    }

}

customElements.define('labycar-slider', LabyCarSlider)