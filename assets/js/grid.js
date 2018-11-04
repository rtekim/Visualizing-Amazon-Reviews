class Grid {

    constructor(books) {

        this.grid = d3.select("#bookGrid").classed("grid", true);
        this.books = books;
    }

    addBooks() {
        let book = this.grid.selectAll("div").data(this.books).enter().append("div");
        book.style("background-image", d => {
            return `url("assets/images/${d.ImageURL}.jpeg")`;
        });
        book.attr("class", d => {
            return this.chooseTileSize(d.TotalReviews)
        });
        book.classed("book", true);
        book.on("click", function (d, i) {
            if (this.className.split(' ').indexOf('open') > -1) {
                d3.select(this).classed("open", false);
            } else {
                let gridColumns = window.getComputedStyle(this.parentElement).gridTemplateColumns.split(" ");
                let gridRows = window.getComputedStyle(this.parentElement).gridTemplateRows.split(" ");
                let numColumns = gridColumns.length;
                let numRows = gridRows.length;
                let xPosInGrid = this.getBoundingClientRect().left - this.parentElement.getBoundingClientRect().left;
                let yPosInGrid = this.getBoundingClientRect().top - this.parentElement.getBoundingClientRect().top;
                let gridRowHeight = parseFloat(gridRows[0]) + parseFloat(window.getComputedStyle(this.parentElement).gridRowGap);
                let gridColumnWidth = parseFloat(gridColumns[0]) + parseFloat(window.getComputedStyle(this.parentElement).gridColumnGap);
                let thisRow = Math.round(yPosInGrid/gridRowHeight) +1;
                let thisColumn = Math.round(xPosInGrid/gridColumnWidth) +1;
                let thisPortrait = this.getElementsByClassName("portrait")[0];
                if(thisPortrait)thisPortrait.setAttribute("src",thisPortrait.getAttribute("data-src"));
                d3.selectAll(".book").classed("open", false);
                d3.selectAll(".book").style("grid-row-start", "auto");
                d3.selectAll(".book").style("grid-column-start", "auto");
                d3.select(this).classed("open", true);
                d3.select(this).style("grid-row-start", thisRow)
                d3.select(this).style("grid-column-start", thisColumn)
            }
        });
    }

    chooseTileSize(totalReviews) {
        if (totalReviews > 1000) {
            return "size5"
        } else if (totalReviews > 800) {
            return "size4"
        } else if (totalReviews > 600) {
            return "size3"
        } else if (totalReviews > 400) {
            return "size2"
        } else {
            return "size1"
        }
    }

}