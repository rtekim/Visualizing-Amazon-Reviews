/**
 * main.js
 *
 * This is where we gather all of the components together and throw them up onto
 * the webpage. It'll be slick.
 */
let grid, table, scatterplot, detailView;

let globalState = { bookSelected: false }; // I'm not sure this is a good idea, but I'm doing it

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

	detailView = new DetailView();
    // grid = new Grid(data);
    scatterplot = new Scatterplot(data, grid);
    table = new Table(data);

    scatterplot.update();
    // grid.addBooks();
    table.createTable();
});
