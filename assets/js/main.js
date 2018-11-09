/**
 * main.js
 *
 * This is where we gather all of the components together and throw them up onto
 * the webpage. It'll be slick.
 */
let grid;
d3.csv("assets/dataset/books_overview.csv").then(data =>{
    grid = new Grid(data);
    grid.addBooks();

    let table = new Table(data);
    table.createTable();
});
