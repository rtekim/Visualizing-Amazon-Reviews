/**
 * main.js
 *
 * This is where we gather all of the components together and throw them up onto
 * the webpage. It'll be slick.
 */
let grid, table, scatterplot, detailView;

d3.csv("assets/dataset/books_overview.csv").then(data =>{
	detailView = new DetailView();
    // grid = new Grid(data);
    scatterplot = new Scatterplot(data, grid);
    table = new Table(data);

    scatterplot.update();
    // grid.addBooks();
    table.createTable();
});
