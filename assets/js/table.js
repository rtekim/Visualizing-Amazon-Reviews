class Table {
    constructor(books, detailedView) {
        this.table = this;
        this.detailedView = detailedView;
        
        this.tableElements = books;

        this.tableHeaders = ["total_reviews", "book_reviews", "ebook_reviews", "verified_reviews", "five_stars",
            "four_stars", "three_stars", "two_stars", "one_star"];

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
            .range([this.cell.height - this.cell.buffer, this.cell.buffer]);

        this.starsScale.domain([0, 1]);
        this.aggregateStarsColorScale.domain(this.starsScale.domain());

        let sortedTableHeaders = this.tableHeaders.map(() => false);

        // Sorting
        d3.selectAll("thead td").data(this.tableHeaders).on("click", (k, i) => {
            let invert;
            if (sortedTableHeaders[i] === true) {
                sortedTableHeaders[i] = false;
                invert = true;
            } else {
                sortedTableHeaders = this.tableHeaders.map(() =>{
                    return false
                });
                sortedTableHeaders[i] = true;
                invert = false;
            }

            this.tableElements = this.tableElements.sort((a, b) => {
                if (invert) {
                    let temp = b;
                    b = a;
                    a = temp;
                }
                if (k === "total_reviews"){
                    if (b[k] === a[k]) {
                        return a.key < b.key ? -1 : 1
                    } else
                        return b[k] - a[k];
            } else {
                    if (b[k]/b["total_reviews"] === a[k]/a["total_reviews"]) {
                        return a.key < b.key ? -1 : 1
                    } else
                        return b[k]/b["total_reviews"] - a[k]/a["total_reviews"];
                }
            });
            this.createTable();
        });

        d3.selectAll("thead th").data('title').on("click", () => {
            this.tableElements = this.tableElements.sort((a, b) =>{
                return a.key < b.key ? -1 : 1
            });
            this.createTable();
        });
    }

    createTable() {
        let that = this;
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements);

        tr.exit().remove();

        let trEnter = tr.enter().append("tr");

        trEnter.append("th");

        tr = trEnter.merge(tr);
        tr.select("th").text(d => d.title).classed("title",true);
        tr.on("click", function(d) {
            that.detailedView.update(d,d3.select(".modal-body"));
            $('#exampleModal').modal('show');
        })

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
            .attr("height", this.cell.height);

        let totalReviewsColumnsEnter = svgEnter.filter(d => {
            return d.column === "total_reviews";
        });

        let totalReviewsColumns = svg.filter(d => {
            return d.column === "total_reviews";
        });

        totalReviewsColumnsEnter.append("rect");
        totalReviewsColumns.select("rect")
            .attr("height", this.bar.height)
            .attr("width", d => d.value>0 ? this.reviewsTotalScale(d.value):0)
    .attr("fill", d => {
            return this.aggregateTotalColorScale(d.value);
        });

        totalReviewsColumnsEnter.append("text");
        totalReviewsColumns.select("text")
            .attr("x", d => d.value ? this.reviewsTotalScale(d.value) : 0)
            .attr("y", this.cell.height / 2)
            .attr("dy", ".35em");

        totalReviewsColumns.select("text")
            .attr("dx", d => {
                return d.value > 2000 ? 10 : 40
            })
            .attr("text-anchor", d => {
                return d.value > 0 ? 'end' : 'start'
            });

        totalReviewsColumns.select("text")
            .classed('label', true)
            .text(d => {
                return d.value;
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
            .attr("width", d => d.value>0 ? this.reviewsbookEbookScale(d.value / d.total):0)
    .attr("fill", d => {
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
            .attr("width", d => d.value>0 ? this.verifiedScale(d.value / d.total):0)
            .attr("fill", d => {
            return this.aggregateVerifiedColorScale(d.value / d.total);
        });

        let starsColumnsEnter = svgEnter.filter(d => {
            return d.column === "five_stars" || d.column === "four_stars" || d.column === "three_stars" || d.column === "two_stars" || d.column === "one_star";
        });

        let starsColumns = svg.filter(d => {
            return d.column === "five_stars" || d.column === "four_stars" || d.column === "three_stars" || d.column === "two_stars" || d.column === "one_star";
        });

        starsColumnsEnter.append("g").attr('transform', 'translate(0, 70) scale(1, -1)').append("rect");
        starsColumns.select("rect").attr("width", 10)
            .attr("y",d=>{
               return d.value/d.total;
            })
            .attr("height", d => d.value>0? this.cell.height-this.starsScale(d.value / d.total):0)
            .attr("fill", d => {
                return this.aggregateStarsColorScale(d.value / d.total);
            });
    }
}