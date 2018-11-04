class Table{
    constructor(books){
        this.tableElements = books;

        this.tableHeaders = ["TotalReviews"];

        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };
    }

    createTable(){
        console.log(this.tableElements);
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements);

        tr.exit().remove();

        let trEnter = tr.enter().append("tr");

        trEnter.append("th");

        tr = trEnter.merge(tr);
        tr.select("th").text(d => d.Title);

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

        let gameColumnsEnter = svgEnter.filter(d => {
            return d.vis === 'bars';
        });

        let gameColumns = svg.filter(d => {
            return d.vis === 'bars';
        });

        gameColumnsEnter.append("rect");
        gameColumns.select("rect")
            .attr("height", this.bar.height)
            .attr("width", d => {
                return d.value;
            });

        gameColumnsEnter.append("text");

        gameColumns.select("text")
            .attr("x", d => d.value)
            .attr("y", this.cell.height / 2)
            .attr("dy", ".35em");

        gameColumns.select("text")
            .attr("dx", d => {
                return d.value > 1 ? -3 : 0
            })
            .attr("text-anchor", d => {
                return d.value > 0 ? 'end' : 'start'
            });

        gameColumns.select("text")
            .classed('label', true)
            .text(d => {
                return d.value;
            });
    }
}