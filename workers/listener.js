/* worker.js */

class Listener {

    constructor(){
        this.semaphore = 'open'
        this.interval = null
    }

    start(time, callback){
        if(this.interval)
            return

        this.tack = callback
        if(time)
           this.interval = setInterval( ()=> this.tick(), time)
        else
            this.tick()
    }

    stop(){
        if(this.interval)
            clearInterval(this.interval)
        this.interval = null
    }

    async tick(){
        if(this.semaphore!='open') {
            return
        }
        this.semaphore = 'close'
        try{
           await this.tack()
        }catch(err){
            console.log(err)
        }finally{
            this.semaphore = 'open'
        }
    }

}

module.exports = Listener
