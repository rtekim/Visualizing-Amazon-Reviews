/**
 * Scatterplot class.
 *
 * Handles all of the DOM manipulation and stuff for the scatterplot.
 *
 * TODO: Put labels on the parts of the axes
 */
class Scatterplot {

	/** Constructor. Takes the data from all_books and the grid layout to update the detail view.*/
	constructor(data, overseer) {
		overseer.scatterplot = this; // Give the overseer a pointer to the scatterplot
		this.bookData = data;
		this.overseer = overseer;

		this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.width = 600 - (this.margin.left + this.margin.right);
        this.height = 400 - (this.margin.top + this.margin.bottom);

		this.availableSelections = data.columns;
		this.availableSelections.shift();

		this.selections = { x: 'average_helpful', y: 'verified_reviews', size: 'total_reviews' };

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

        this.plotGroup = this.svg.append('g')
        	.attr('id', 'scatterplot-plot-group')
			.attr('transform', 'translate(15, ' + this.height + ') scale(1, -1)')
			.classed('axis', true);

		this.tickMarks = [0.0, 0.0, 0.25, 0.5, 0.75, 1.0];

		let thingy = this.axisGroup.selectAll('line')
			.data(this.tickMarks)
			.enter();

		thingy.append('line')
			.attr('x1', (d) =>  { return (d * this.width) + this.margin.left })
			.attr('y1', this.margin.bottom - 5)
			.attr('x2', (d) =>  { return (d * this.width) + this.margin.left })
			.attr('y2', this.margin.bottom + 5)
			.classed('tick-marks', true);

		thingy.append('line')
			.attr('x1', this.margin.left - 5)
			.attr('y1', (d) =>  { return (d * this.height) })
			.attr('x2', this.margin.left + 5)
			.attr('y2', (d) =>  { return (d * this.height) })
			.classed('tick-marks', true);

        this.controlPanel = {};
        this.controlPanel.x = this.addSelector(d3.select('#scattterplot-dropdown-x'), 'x', this.selections.x);
        this.controlPanel.y = this.addSelector(d3.select('#scattterplot-dropdown-y'), 'y', this.selections.y);
        this.controlPanel.size = this.addSelector(d3.select('#scattterplot-dropdown-size'), 'size', this.selections.size);

        this.update();
	}

	/** Updates the scatterplot with all of the various pieces of information*/
	update() {
		this.plotGroup.selectAll('circle').remove();

		// Get the data together, along with the maxima and minima
		let toShow = this.bookData.map((d) => {
			return { title: d.title, x: d[this.selections.x], y: d[this.selections.y], size: d[this.selections.size]};
		});

		let limits = this.maximaAndMinimaOf(toShow);
		let xScale = d3.scaleLinear()
			.domain([limits.x.min, limits.x.max])
			.range([this.margin.left, this.margin.left + this.width]);
		let yScale = d3.scaleLinear()
			.domain([limits.y.min, limits.y.max])
			.range([this.margin.bottom, this.height - this.margin.top]);
		let sizeScale = d3.scaleSqrt()
			.domain([limits.size.min, limits.size.max])
			.range([2, 20]);

		let circles = this.plotGroup.selectAll('circle')
			.data(toShow)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d.x))
			.attr('cy', (d) => yScale(d.y))
			.attr('r', (d) => sizeScale(d.size))
			.classed('book-circle', true)
			.on('mouseover', handleMouseOver)
			.on('mouseout', handleMouseOut)
			.on('click', (d, i) => { this.overseer.bookSelected(this.bookData[i]); });

		let that = this;

		// TODO: If the detail view is being shown, then keep the mouse over stuff visible

		function handleMouseOver(d, i) {
			that.showBook(that.bookData[i]);
			d3.select(this).style('fill', '#FF0000');
		}

		function handleMouseOut(d, i) {
			that.hideBook();
			d3.select(this).style('fill', '#000000');
		}
	}

	/** Helper method. Grabs the maxima and minima of the data to show to the user. */
	maximaAndMinimaOf(dataToShow) {
		let limits = { 
			x: { min: Infinity, max: -Infinity }, 
			y: { min: Infinity, max: -Infinity }, 
			size: { min: Infinity, max: -Infinity } 
		};

		dataToShow.forEach((d) => {
			if (d.x < limits.x.min) limits.x.min = d.x;
			if (d.x > limits.x.max) limits.x.max = d.x;
			if (d.y < limits.y.min) limits.y.min = d.y;
			if (d.y > limits.y.max) limits.y.max = d.y;
			if (d.size < limits.size.min) limits.size.min = d.size;
			if (d.size > limits.size.max) limits.size.max = d.size;
		});

		return limits;
	}

	/** Helper method. Adds a select element with the option provided as the currently selected option. */
	addSelector(container, plotAxis, selectedOption) {
		let selector = container.append('select')
        	.attr('id', 'scatterplot-control-' + plotAxis);

        let options = selector.selectAll('option')
        	.data(this.availableSelections)
        	.enter()
        	.append('option')
        	.text((d) => { return d.replace('_', ' ') })
        	.attr('value', (d) => { return d });

        options.filter((d) => { if (d === selectedOption) return d; })
        	.attr('selected', 'selected');

        let that = this;

        selector.on('change', function(d, i) {
        	that.selections[plotAxis] = this.options[this.selectedIndex].value;
        	that.update();
        });

        return selector;
	}

	/** Helper method. Shows the book provided on the miniature detail view on the side. */
	showBook(book) {
		$('#scatterplot-mouse-over-title').text(book.title);
		$('#scatterplot-mouse-over-total-reviews').text(book.total_reviews);
		$('#scatterplot-mouse-over-book-reviews').text(book.book_reviews);
		$('#scatterplot-mouse-over-ebook-reviews').text(book.ebook_reviews);
		$('#scatterplot-mouse-over-verified-reviews').text(book.verified_reviews);
		$('#scatterplot-mouse-over').show();
	}

	/** Helper method. Hides the book that is currently shown. */
	hideBook() {
		$('#scatterplot-mouse-over').hide();
	}
}