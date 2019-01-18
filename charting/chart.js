class Chart {
    constructor(options)   {
        this.margin = options.margin
        this.container = '#'+options.container

        this.width = 960 - this.margin.left - this.margin.right
        this.height = 500 - this.margin.top - this.margin.bottom

        this.parseDate = d3.timeParse("%d-%b-%y")

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
        this.data = points.split("\n")
        var accessor = this.candlestick.accessor()
        var that = this

        this.data = this.data.slice(0, 200).map(function(da) {
            // *******************************************
            // DATA FORMAT
            // *******************************************
            var d = da.split(',')
            return {
                date: that.parseDate(d[0]),
                open: +d[1],
                high: +d[2],
                low: +d[3],
                close: +d[4],
                volume: +d[5]
            }
            // *******************************************
            // *******************************************
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)) })
    }

    setNotes(notes){
        this.notes = notes
    }

    addNote(note){
        if(this.notes) this.notes.push(note)
    }

    setLines(trendlines){
        this.trendlines = trendlines
    }

    addLine(trendline){
        if(this.trendlines) this.trendlines.push(trendline)
    }

    draw() {
        this.x.domain(this.data.map(this.candlestick.accessor().d))
        this.y.domain(techan.scale.plot.ohlc(this.data, this.candlestick.accessor()).domain())

        // draw each svg elems
        this.svg.selectAll("g.candlestick").datum(this.data).call(this.candlestick)
        if(this.notes)
            this.svg.selectAll("g.tradearrow").datum(this.notes).call(this.tradearrow)
        if(this.trendlines)
            this.svg.selectAll("g.trendlines").datum(this.trendlines).call(this.trendline) //.call(trendline.drag);
        this.svg.selectAll("g.x.axis").call(this.xAxis)
        this.svg.selectAll("g.y.axis").call(this.yAxis)

    }


}