/**
 * histogram.js
 *
 * Histogram to be included on the detail view.
 */
class Histogram {

	constructor() {
		this.selectedCategory = 'starRating';
		this.dimensions = { width: 450, height: 300, padding: 20 };
		this.allYears = ['1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', 
			'2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
	}

	/** Update the instagram with the new set of reviews and parent element to append to */
	update(reviewSet, parentElement) {
		this.data = this.extractData(reviewSet);
		this.categories = this.extractCategories();
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
	}

	/** Draws the currently selected category for each year. */
	drawCategory(category) {
		this.allYears.forEach((year) => {
			if (this.data[year]) {
				if (category === 'starRating') {
					this.drawStarsBar(year, this.data[year]);
				}
			}
		});
	}

	/** Helper method. Draws the stacked bar graph for stars for the year provided. */
	drawStarsBar(year, dataset) {
		let yearGroup = this.rectGroup.select('#year-group-' + year);
		let maxHeight = (dataset.length / this.totalReviews) * this.dimensions.height;
		let xPos = (this.dimensions.width / this.allYears.length) * this.allYears.indexOf(year);
		let width = (this.dimensions.width / this.allYears.length) - 2;

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

		yearGroup.selectAll('rect')
			.data(stars)
			.enter()
			.append('rect')
			.attr('x', xPos)
			.attr('y', (d, i) => {
				if (i === 0) {
					return this.dimensions.padding;
				} else {
					let value = d3.sum(stars.slice(0, i));

					return (value / dataset.length) * maxHeight + this.dimensions.padding;
				}
			})
			.attr('width', width)
			.attr('height', (d, i) => {
				return (d / dataset.length) * maxHeight;
			})
			.style('fill', (d, i) => {
				let r = 150 + (i * 18);
				let g = 140 + (i * 18);

				return 'rgb(' + r + ', ' + g + ', 0)';
			})
			.append('svg:title')
			.text((d, i) => { return (i + 1) + ' stars' });
	}

	/** Helper method. Draws the stacked bar graph for ebook/regular book reviews. */
	drawEBooksBar(year, dataset) {
		// TODO: This
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

	/** Helper method. Gets all the possible categories from the review set provided. */
	extractCategories() {
		let categories = null;
		this.allYears.forEach((year) => {
			if (this.data[year] && this.data[year][0]) {
				categories = Object.keys(this.data[year][0]);
			}
		});

		return categories;
	}
}