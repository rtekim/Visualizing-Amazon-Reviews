/**
 * main.js
 *
 * This is where we gather all of the components together and throw them up onto
 * the webpage. It'll be slick.
 */
let grid;
d3.json("assets/dataset/books/allbooks.json").then(data =>{
    grid = new Grid(data);
    grid.addBooks();

    let table = new Table(data);
    table.createTable();
});

