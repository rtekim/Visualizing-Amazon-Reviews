class Table {
    constructor(books, overseer) {
        overseer.table = this;
        this.overseer = overseer;
        
        this.tableElements = books;

        this.tableHeaders = ["total_reviews", "book_reviews", "ebook_reviews", "verified_reviews", "five_stars",
            "four_stars", "three_stars", "two_stars", "one_star", "average_helpful"];

        this.cell = {
            "width": 70,
            "height": 70,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        this.createScales();
    }

    createScales() {
        this.aggregateTotalColorScale = d3.scaleLinear()
            .range(['#feebe2', '#0000FF']);

        this.reviewsTotalScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer]);

        this.reviewsTotalScale.domain([0, d3.max(this.tableElements, d => d["total_reviews"])]);
        this.aggregateTotalColorScale.domain(this.reviewsTotalScale.domain());

        this.aggregatebookEbookColorScale = d3.scaleLinear()
            .range(['#feebe2', '#ff0000']);

        this.reviewsbookEbookScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer]);

        this.reviewsbookEbookScale.domain([0, 1]);
        this.aggregatebookEbookColorScale.domain(this.reviewsbookEbookScale.domain());

        this.aggregateVerifiedColorScale = d3.scaleLinear()
            .range(['#feebe2', '#00ff00']);

        this.verifiedScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer]);

        this.verifiedScale.domain([0, 1]);
        this.aggregateVerifiedColorScale.domain(this.verifiedScale.domain());

        this.aggregateStarsColorScale = d3.scaleLinear()
            .range(['#feebe2', '#000000']);

        this.starsScale = d3.scaleLinear()
            .range([0, this.cell.height - this.cell.buffer]);

        this.starsScale.domain([0, 1]);
        this.aggregateStarsColorScale.domain(this.starsScale.domain());
    }

    createTable() {
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements);

        tr.exit().remove();

        let trEnter = tr.enter().append("tr");

        trEnter.append("th");

        tr = trEnter.merge(tr);
        tr.select("th").text(d => d.title).classed("title",true);


        let td = tr.selectAll("td")
            .data(d => {
                return this.tableHeaders.map((k, i) => {
                    return {'vis': 'bars', 'value': d[k], 'column': k, 'total': d["total_reviews"]}
                });
            });

        td.exit().remove();

        let tdEnter = td.enter().append("td");

        let svgEnter = tdEnter.filter(d => {
            return d.vis !== 'text'
        }).append("svg");

        td = tdEnter.merge(td);

        let svg = td.select("svg")
            .attr("width", d => d.vis === 'bars' ? this.cell.width : 2 * this.cell.width)
            .attr("height", this.cell.height - this.cell.buffer);

        let totalReviewsColumnsEnter = svgEnter.filter(d => {
            return d.column === "total_reviews";
        });

        let totalReviewsColumns = svg.filter(d => {
            return d.column === "total_reviews";
        });

        totalReviewsColumnsEnter.append("rect");
        totalReviewsColumns.select("rect")
            .attr("height", this.bar.height)
            .attr("width", d => {
                return this.reviewsTotalScale(d.value);
            }).attr("fill", d => {
            return this.aggregateTotalColorScale(d.value);
        });


        let bookEbookColumnsEnter = svgEnter.filter(d => {
            return d.column === "book_reviews" || d.column === "ebook_reviews";
        });

        let bookEbookColumns = svg.filter(d => {
            return d.column === "book_reviews" || d.column === "ebook_reviews";
        });

        bookEbookColumnsEnter.append("rect");
        bookEbookColumns.select("rect")
            .attr("height", this.bar.height)
            .attr("width", d => {
                return this.reviewsbookEbookScale(d.value / d.total);
            }).attr("fill", d => {
            return this.aggregatebookEbookColorScale(d.value / d.total);
        });

        let verifiedColumnsEnter = svgEnter.filter(d => {
            return d.column === "verified_reviews";
        });

        let verifiedColumns = svg.filter(d => {
            return d.column === "verified_reviews";
        });

        verifiedColumnsEnter.append("rect");
        verifiedColumns.select("rect")
            .attr("height", this.bar.height)
            .attr("width", d => {
                return this.verifiedScale(d.value / d.total);
            }).attr("fill", d => {
            return this.aggregateVerifiedColorScale(d.value / d.total);
        });

        let starsColumnsEnter = svgEnter.filter(d => {
            return d.column === "five_stars" || d.column === "four_stars" || d.column === "three_stars" || d.column === "two_stars" || d.column === "one_star";
        });

        let starsColumns = svg.filter(d => {
            return d.column === "five_stars" || d.column === "four_stars" || d.column === "three_stars" || d.column === "two_stars" || d.column === "one_star";
        });

        starsColumnsEnter.append("rect");
        starsColumns.select("rect").attr("width", 10)
            .attr("height", d => {
                return this.starsScale(d.value / d.total);
            })
            .attr("fill", d => {
                return this.aggregateStarsColorScale(d.value / d.total);
            });

        // Dragging Rows
        // d3.selectAll("tr").call(d3.drag()
        //     .origin(function(d) {
        //         return {y: y(d[0].y)};
        //     })
        //     .on("dragstart", function(d) {
        //
        //         trigger = d3.event.sourceEvent.target.className.baseVal;
        //
        //         if (trigger == "title") {
        //             d3.selectAll("td").attr("opacity", 1);
        //             dragging[d[0].y] = y(d[0].y);
        //
        //             // Move the row that is moving on the front
        //             sel = d3.select(this);
        //             sel.moveToFront();
        //         }
        //     })
        //     .on("drag", function(d) {
        //         // Hide what is in the back
        //
        //         if (trigger == "title") {
        //
        //             //d3.selectAll(".cellcolumn").attr("opacity", 0);
        //
        //             dragging[d[0].y] = Math.min(height, Math.max(0, d3.event.y));
        //             orders.name.sort(function(a, b) { return position(a) - position(b); });
        //             y.domain(orders.name);
        //
        //             d3.selectAll("tr").attr("transform", function(d, i) {
        //                 return "translate(0," + position(d[0].y) + ")";
        //             });
        //         }
        //     })
        //     .on("dragend", function(d) {
        //
        //         if (trigger == "title") {
        //             delete dragging[d[0].y];
        //             transition(d3.select(this)).attr("transform", "translate(0," + y(d[0].y) + ")");
        //
        //             d3.selectAll("tr").each(function(d) {
        //                 d3.select(this).selectAll("td").attr("x", function(d) {
        //                     return -y(d.y)-90; });
        //             });
        //         }
        //     })
        // );
    }
}