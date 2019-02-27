class Chart {
    constructor(options)   {
        options = options || {}
        this.margin = options.margin || { top: 20, right: 20, bottom: 30, left: 50 }
        this.container = options.container ? '#'+options.container:'#chart'

        this.width = 960 - this.margin.left - this.margin.right
        this.height = 500 - this.margin.top - this.margin.bottom

        this.x = techan.scale.financetime()
            .range([0, this.width])

        this.y = d3.scaleLinear()
            .range([this.height, 0])

        // runtime function
        this.candlestick = techan.plot.candlestick()
            .xScale(this.x)
            .yScale(this.y)

        this.tradearrow = techan.plot.tradearrow()
            .xScale(this.x)
            .yScale(this.y)
            .orient(function(d) { return d.type.startsWith("buy") ? "up" : "down"; })
            // .on("mouseenter", enter)
            // .on("mouseout", out);

        this.trendline = techan.plot.trendline()
            .xScale(this.x)
            .yScale(this.y)
            // .on("mouseenter", enter)
            // .on("mouseout", out)
            // .on("drag", drag);

        this.line = techan.plot.sma()
            .xScale(this.x)
            .yScale(this.y)

        this.xAxis = d3.axisBottom()
            .scale(this.x)

        this.yAxis = d3.axisLeft()
            .scale(this.y)

        // SVG setting
        this.svg = d3.select(this.container).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

        this.svg.append("g").attr("class", "candlestick")
        this.svg.append("g").attr("class", "tradearrow")
        this.svg.append("g").attr("class", "trendlines")
        for(let i=0; i<10; i++)
            this.svg.append("g").attr("class", "lines line"+i)
        this.svg.append("g").attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
        this.svg.append("g").attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)")
    }

    setData(points) {
        // console.log(points)
        // this.data = points
        var accessor = this.candlestick.accessor()

        this.data = points.map(function(d) {
            // *******************************************
            // DATA FORMAT
            // *******************************************
            return {
                date: new Date(d[0]),
                open: +d[1],
                high: +d[2],
                low: +d[3],
                close: +d[4],
                volume: +d[5]
            }
            // *******************************************
            // *******************************************
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)) })
        // console.log(this.data)
    }

    setNotes(notes){
        this.notes = notes
    }
    addNote(note){
        if(this.notes) this.notes.push(note)
    }
    setTrendlines(trendlines){
        this.trendlines = trendlines
    }
    addTrendLine(trendline){
        if(this.trendlines) this.trendlines.push(trendline)
    }
    setLines(lines){
        this.lines = [lines]
    }
    addLine(line){
        this.lines.push(line)
    }


    draw() {
        this.x.domain(this.data.map(this.candlestick.accessor().d))
        this.y.domain(techan.scale.plot.ohlc(this.data, this.candlestick.accessor()).domain())
        this.svg.selectAll("g.candlestick").datum(this.data).call(this.candlestick)

        if(this.notes)
            this.svg.selectAll("g.tradearrow").datum(this.notes).call(this.tradearrow)
        if(this.trendlines)
            this.svg.selectAll("g.trendlines").datum(this.trendlines).call(this.trendline) //.call(trendline.drag);
        if(this.lines){
            this.lines.forEach( (l, i) => {
                this.svg.select("g.line"+i).datum(l).call(this.line)
            })
        }
        this.svg.selectAll("g.x.axis").call(this.xAxis)
        this.svg.selectAll("g.y.axis").call(this.yAxis)
    }


}