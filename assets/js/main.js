/**
 * main.js
 *
 * This is where we gather all of the components together and throw them up onto
 * the webpage. It'll be slick.
 */

/** Class that oversees all the separate views and handles all of the interaction between separate pieces. */
class Overseer {

	constructor() {

	}

	/** Indicates that a book was selected. */
	bookSelected(book) {
		// TODO: Check and see if the table is up. If so, then append the detail view to that row of the table.
		// TODO: Otherwise, hand it the book that was selected in the grid
		this.detailView.update(book, d3.select('#detail-view-container'));
		$(window).scrollTop($('#detail-view-holder').position().top);
	}

	detailViewClosed() {

	}
}

let overseer = new Overseer();

let grid, table, scatterplot, detailView;

d3.csv("assets/dataset/books_overview.csv").then(data => {
	// We want numbers for all of the pieces of data, so let's go ahead and clean that up
	let columns = data.columns;
	data = data.map((d) => {
		let newDataPoint = { title: d.title };

		data.columns.forEach((col) => {
			if (col !== 'title') {
				newDataPoint[col] = parseFloat(d[col]);
			}
		})

		return newDataPoint; 
	});
	data.columns = columns;

	detailView = new DetailView(overseer);
    grid = new Grid(data);
    scatterplot = new Scatterplot(data, overseer);
    table = new Table(data, detailView);
    grid.addBooks();
    table.createTable();
});
