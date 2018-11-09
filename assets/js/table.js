class Table {
    constructor(books) {
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
        this.reviewsScale = d3.scaleLinear()
            .range([0, this.cell.width - this.cell.buffer]);

        this.aggregateColorScale = d3.scaleLinear()
            .range(['#feebe2', '#0000FF']);

        this.reviewsScale.domain([0, d3.max(this.tableElements, d => d["total_reviews"])]);
        this.aggregateColorScale.domain(this.reviewsScale.domain());
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
                    return {'vis': 'bars', 'value': d[k]}
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

        let booksColumnsEnter = svgEnter.filter(d => {
            return d.vis === 'bars';
        });

        let booksColumns = svg.filter(d => {
            return d.vis === 'bars';
        });

        booksColumnsEnter.append("rect");
        booksColumns.select("rect")
            .attr("height", this.bar.height)
            .attr("width", d => {
                return this.reviewsScale(d.value);
            }).attr("fill", d => {
            return this.aggregateColorScale(d.value);
        });

    }
}