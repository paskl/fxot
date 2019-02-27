


/// TODO
var base = 'http://127.0.0.1:3000/'

/***************
    MAIN
*****************/
const framex = {

    components: {},

    targets: {},

    init: (params) => {
        // parse elements in the document /// TODO : use external file
        framex.getElements()

        // Initialize routes
        // https://github.com/riot/route/tree/master/doc
        params.pages.forEach( p => {
            route(p.route, p.action)
        })
        route('*', () => {
            console.log('404')
        })
        route.start()

    },

    getElements: () =>{
        $('component').each( (i,c) => {
          framex.components[ $(c).attr('name') ] = $(c).html()
        })
        $('target').each( (i,c) => {
          framex.targets[ $(c).attr('name') ] = c
        })
    },

    reset: () =>{
        for(let t in framex.targets){ $(framex.targets[t]).html('') }
    },

    write: (target, component, attributes) => {
        $(framex.targets[target]).append(
            Mustache.render(framex.components[component], attributes)
        )
    },

    source: (url, transform) => {
        return new Promise( (resolve,reject) =>{
            $.get( base+url, res  => {
                if(transform) res = transform(res)
                resolve(res)
            })
        })
    },

     waitFor: (url, condition) => {
        return new Promise( (resolve,reject) =>{
            var rec = () => {
                setTimeout( () => {
                    $.get( base+url, res  => {
                        console.log(res)
                        if(res && res.status == 'done') resolve(res)
                        else rec()
                    })
                }, 1000)
            }
            rec()
        })
     }

}





