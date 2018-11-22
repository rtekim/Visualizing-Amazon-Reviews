class Table {
    constructor(books, overseer) {
        overseer.table = this;
        this.overseer = overseer;
        
        this.tableElements = books;

        this.tableHeaders = ["total_reviews", "book_reviews", "ebook_reviews", "verified_reviews", "five_stars",
            "four_stars", "three_stars", "two_stars", "one_star", "average_helpful"];

        this.cell = {
            "width": 70,
            "height": 20,
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
            .range(['#feebe2', '#0000FF']);

        this.reviewsbookEbookScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer]);

        this.reviewsbookEbookScale.domain([0, d3.max(this.tableElements, d => {
            return (d["book_reviews"] < d["ebook_reviews"]) ? d["ebook_reviews"] : d["book_reviews"];
        })]);
        this.aggregatebookEbookColorScale.domain(this.reviewsbookEbookScale.domain());

        this.aggregateVerifiedColorScale = d3.scaleLinear()
            .range(['#feebe2', '#0000FF']);

        this.verifiedScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer]);

        this.verifiedScale.domain([0, d3.max(this.tableElements, d => d["verified_reviews"])]);
        this.aggregateVerifiedColorScale.domain(this.verifiedScale.domain());

        this.aggregateStarsColorScale = d3.scaleLinear()
            .range(['#feebe2', '#0000FF']);

        this.starsScale = d3.scaleLinear()
            .range([0, this.cell.height - this.cell.buffer]);

        this.starsScale.domain([0, d3.max(this.tableElements, d => {
            return (d["five_stars"] < d["four_stars"]) ? d["four_stars"] : d["five_stars"];
        })]);
        this.aggregateStarsColorScale.domain(this.starsScale.domain());
    }

    createTable() {
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements);

        tr.exit().remove();

        let trEnter = tr.enter().append("tr");

        trEnter.append("th");

        tr = trEnter.merge(tr);
        tr.select("th").text(d => d.title);

        let td = tr.selectAll("td")
            .data(d => {
                return this.tableHeaders.map((k, i) => {
                    return {'vis': 'bars', 'value': d[k], 'column': k}
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
                return this.reviewsbookEbookScale(d.value);
            }).attr("fill", d => {
            return this.aggregatebookEbookColorScale(d.value);
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
                return this.verifiedScale(d.value);
            }).attr("fill", d => {
            return this.aggregateVerifiedColorScale(d.value);
        });

        let starsColumnsEnter = svgEnter.filter(d => {
            return d.column === "five_stars"||d.column === "four_stars"||d.column === "three_stars"||d.column === "two_stars"||d.column === "one_stars";
        });

        let starsColumns = svg.filter(d => {
            return d.column === "five_stars"||d.column === "four_stars"||d.column === "three_stars"||d.column === "two_stars"||d.column === "one_stars";
        });

        starsColumnsEnter.append("rect");
        starsColumns.select("rect")
            .attr("height", d=>{
                return this.starsScale(d.value);
            })
            .attr("width",10).attr("fill", d => {
            return this.aggregateStarsColorScale(d.value);
        });
    }
}