export default class TypingText {
    constructor(element, html, opts={}){
        this.html = html
        this.element = element
        this.opts = Object.assign({
            minSpeed: 50,
            maxSpeed: 10
        }, opts)
        this.shadow = document.createElement('div')
    }

    async do(){
        this.shadow.innerHTML = this.html
        this.currentElement = null
        this.erase()
        await this.writeElement(this.shadow)
    }

    async writeElement(element, currentParent=null){
        currentParent = currentParent || this.element
        if(element.childNodes.length){
            for(let children of element.childNodes){
                if(children.childNodes.length){
                    this.currentElement = children.cloneNode()
                    this.currentElement.innerHTML = ""
                    currentParent.append(this.currentElement)
                    await this.writeElement(children, this.currentElement)
                }
                else {
                    this.currentElement = currentParent
                    await this.writeText(children.textContent, this.currentElement)
                }
            }
        }
    }

    async writeText(text, element){
        let currentIndex = 0
        return new Promise(res => {
            const loop = ()=>{
                element.innerHTML += text[currentIndex]
                currentIndex++
                if(currentIndex < text.length) this.timeout = setTimeout(()=> loop(), Math.random() * (this.opts.minSpeed - this.opts.maxSpeed)+this.opts.maxSpeed)
                else res()
            }
            loop()
        })
    }

    erase(){
        this.element.innerHTML = ""
        this.raw = ""
        return this
    }

    write(text){
        if(this.timeout) clearTimeout(this.timeout)
        this.erase()
        this.shadow.innerHTML = text
        this.writeElement(this.shadow)
    }
}