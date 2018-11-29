/**
 * histogram.js
 *
 * Histogram to be included on the detail view.
 *
 * TODO: Include lines for the bars along with measurements
 * TODO: Mouse over the separate bars should indicate how many reviews there are in that category
 */
class Histogram {

	constructor() {
		this.selectedCategory = 'starRating';
		this.dimensions = { width: 450, height: 300, padding: 20, bars: { width: 18, xPad: 2} };
		this.allYears = ['1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', 
			'2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
		this.categories = [ 'starRating', 'verified', 'year', 'isEBook' ]
	}

	/** Update the instagram with the new set of reviews and parent element to append to */
	update(reviewSet, parentElement) {
		this.data = this.extractData(reviewSet);
		this.parent = parentElement;
		this.totalReviews = reviewSet.length;

		// Draw the histogram
		this.holder = parentElement.append('div');
		this.svg = this.holder.append('svg')
			.attr('width', this.dimensions.width)
			.attr('height', this.dimensions.height);

		this.rectGroup = this.svg.append('g')
			.attr('transform', 'translate(15, ' + this.dimensions.height + ') scale(1, -1)');

		this.rectGroup.selectAll('g')
			.data(this.allYears)
			.enter()
			.append('g')
			.attr('id', (d) => { return 'year-group-' + d; })
			.classed('histogram-year-group', true);

		this.rectGroup.append('line')
			.attr('x1', 0)
			.attr('y1', this.dimensions.padding)
			.attr('x2', this.dimensions.width)
			.attr('y2', this.dimensions.padding)
			.style('stroke', 'black');

		this.allYears.forEach((year) => {
			let info = this.getBarsDrawInfo(year, []);

			this.svg
				.append('text')
				.attr('x', info.xPos)
				.attr('dx', 18)
				.attr('y', this.dimensions.height - (this.dimensions.padding / 2))
				.classed('histogram-year-label', true)
				.text(year.slice(2, 5))
				.append('svg:title')
				.text('Year');
		});
	}

	/** Draws the currently selected category for each year. */
	drawCategory(category) {
		this.allYears.forEach((year) => {
			this.rectGroup.select('#year-group-' + year).selectAll('rect').remove();

			if (this.data[year]) {
				if (category === 'starRating') {
					this.drawStarsBar(year, this.data[year]);
				} else if (category === 'verified') {
					this.drawVerifiedBar(year, this.data[year]);
				} else if (category === 'year') {
					this.drawYearBar(year, this.data[year]);
				} else if (category === 'isEBook') {
					this.drawEBooksBar(year, this.data[year]);
				}
			}
		});
	}

	/** Helper method. Draws the stacked bar graph for stars for the year provided. */
	drawStarsBar(year, dataset) {
		let info = this.getBarsDrawInfo(year, dataset);

		let stars = [];
		dataset.forEach((d) => {
			if (stars[d.starRating - 1]) {
				stars[d.starRating - 1] += 1;
			} else {
				stars[d.starRating - 1] = 1;
			}
		});

		for (let i = 0; i < 5; i++) {
			if (!stars[i]) {
				stars[i] = 0;
			}
		}

		info.yearGroup.selectAll('rect')
			.data(stars)
			.enter()
			.append('rect')
			.attr('x', info.xPos)
			.attr('y', (d, i) => {
				if (i === 0) {
					return this.dimensions.padding;
				} else {
					let value = d3.sum(stars.slice(0, i));

					return (value / dataset.length) * info.maxHeight + this.dimensions.padding;
				}
			})
			.attr('width', info.width)
			.attr('height', (d, i) => {
				return (d / dataset.length) * info.maxHeight;
			})
			.style('fill', (d, i) => {
				let r = 150 + (i * 18);
				let g = 140 + (i * 18);

				return 'rgb(' + r + ', ' + g + ', 0)';
			})
			.append('svg:title')
			.text((d, i) => { return (i + 1) + ' stars' });
	}

	/** Helper method. Draws the stacked bar graph for verified reviews. */
	drawVerifiedBar(year, dataset) {
		let info = this.getBarsDrawInfo(year, dataset);

		info.yearGroup.append('rect')
			.attr('x', info.xPos)
			.attr('y', this.dimensions.padding)
			.attr('width', info.width)
			.attr('height', info.maxHeight)
			.style('fill', '#006AC6')
			.append('svg:title')
			.text('Non-Verified');

		let verified = dataset.filter((d) => d.verified);

		info.yearGroup.append('rect')
			.attr('x', info.xPos)
			.attr('y', this.dimensions.padding)
			.attr('width', info.width)
			.attr('height', (verified.length / dataset.length) * info.maxHeight)
			.style('fill', '#0081F1')
			.append('svg:title')
			.text('Verified');
	}

	/** Helper method. Draws a simple bar for the year provided. */
	drawYearBar(year, dataset) {
		let info = this.getBarsDrawInfo(year, dataset);

		info.yearGroup.append('rect')
			.attr('x', info.xPos)
			.attr('y', this.dimensions.padding)
			.attr('width', info.width)
			.attr('height', info.maxHeight)
			.style('fill', '#00B99F');
	}

	/** Helper method. Draws the stacked bar graph for ebook/regular book reviews. */
	drawEBooksBar(year, dataset) {
		let info = this.getBarsDrawInfo(year, dataset);

		info.yearGroup.append('rect')
			.attr('x', info.xPos)
			.attr('y', this.dimensions.padding)
			.attr('width', info.width)
			.attr('height', info.maxHeight)
			.style('fill', '#CA6C00')
			.append('svg:title')
			.text('eBook');

		let eBook = dataset.filter((d) => d.isEBook);

		info.yearGroup.append('rect')
			.attr('x', info.xPos)
			.attr('y', this.dimensions.padding)
			.attr('width', info.width)
			.attr('height', (eBook.length / dataset.length) * info.maxHeight)
			.style('fill', '#E67A00')
			.append('svg:title')
			.text('Dead Tree');
	}

	/** Helper method. Grabs data for the year provided to help draw the various year bars. */
	getBarsDrawInfo(year, dataset) {
		let info = {};

		info.yearGroup = this.rectGroup.select('#year-group-' + year);
		info.maxHeight = (dataset.length / this.totalReviews) * this.dimensions.height;
		info.xPos = ((this.dimensions.width - this.dimensions.padding) / this.allYears.length) * this.allYears.indexOf(year);
		info.width = ((this.dimensions.width) / this.allYears.length) - this.dimensions.bars.xPad;

		return info;
	}

	/** Helper method. Extract all of the data from the review set. */
	extractData(reviewSet) {
		let newSet = reviewSet.map((d) => {
			let r = {};
			r.marketplace = d.marketplace;
			r.starRating = parseFloat(d.star_rating);
			r.verified = d.verified_purchase.toLowerCase() === 'y';
			r.year = d.review_date.split(/-/g)[0];
			r.vine = d.vine;
			r.helpfulness = d.total_votes > 0 ? (parseFloat(d.helpful_votes) / parseFloat(d.total_votes)) : 0.0;
			r.isEBook = d.product_category !== 'Books';
			return r;
		});

		let nested = d3.nest()
			.key((d) => { return d.year })
			.rollup((review) => {
				return review;
			}).entries(newSet);

		let actualSet = {};
		nested.forEach((d) => {
			actualSet[d.key] = d.value;
		});

		return actualSet;
	}
}