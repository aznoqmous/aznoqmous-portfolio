export default class Canvas {
    
    constructor(opts={}){
        this.opts = Object.assign({
            width: 800,
            height: 600,
            container: document.body
        }, opts)
        this.setup()
    }

    setup(){
        this.c = document.createElement("canvas")
        this.c.width = this.opts.width
        this.c.height = this.opts.height
        this.opts.container.append(this.c)
        this.ctx = this.c.getContext("2d")
    }
    
    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}