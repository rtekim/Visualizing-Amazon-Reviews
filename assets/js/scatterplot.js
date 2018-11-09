/**
 * Scatterplot class.
 *
 * Handles all of the DOM manipulation and stuff for the scatterplot.
 */
class Scatterplot {

	/** Constructor. Takes the data from all_books and the grid layout to update the detail view.*/
	constructor(data, grid) {
		this.bookData = data;
		this.grid = grid;

		this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

		// So here's the skinny: we need x, y, and size attributes. We need to encode them like we did with the gap plot.
		// We then need to allow the user to select which attributes to display and update them accordingly.

		// Let's have x be "total reviews," y be verified reviews, and size be average helpfulness
		this.availableSelections = data.columns;
		this.availableSelections.shift();

		this.selections = { x: 'total_reviews', y: 'verified_reviews', size: 'average_helpful' };

		// Now let's throw the plot up
		this.svg = d3.select('#scatterplot-container').append('svg')
			.attr('id', 'scatterplot')
			.attr('width', this.width + this.margin.right + this.margin.left)
			.attr('height', this.height + this.margin.top + this.margin.bottom);

		this.axisGroup = this.svg.append('g')
			.attr('id', 'scatterplot-axis-group')
			.attr('transform', 'translate(15, ' + this.height + ') scale(1, -1)')
			.classed('axis', true);

		this.axisGroup.append('line')
			.attr('x1', this.margin.left)
            .attr('y1', this.margin.bottom)
            .attr('x2', this.margin.left + this.width)
            .attr('y2', this.margin.bottom);

        this.axisGroup.append('line')
        	.attr('x1', this.margin.left)
            .attr('y1', this.margin.bottom)
            .attr('x2', this.margin.left)
            .attr('y2', this.margin.bottom + this.height);

        // TODO: Control panel, small set of details on book selected

        this.update();
	}

	/** Updates the scatterplot with all of the various pieces of information*/
	update() {
		
	}
}