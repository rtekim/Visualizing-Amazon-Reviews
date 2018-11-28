/**
 * detailView.js
 *
 * Class handling the detail view, showing information about the books.
 *
 * TODO: Visualizations of the various pieces of data we have
 * TODO: Word cloud. Put the data in a separate file and then the detail view will grab and use that instead.
 * TODO: Close button
 */
class DetailView {
	constructor(overseer) {
		overseer.detailView = this;
		this.overseer = overseer;

		this.dimensions = {};
		this.dimensions.cloud = { width: 500, height: 500 };
		this.dimensions.bars = { width: 450, height: 25 };

		// this.cloud = d3.layout.cloud()
		// 	.size([this.dimensions.cloud.width, this.dimensions.cloud.height ])
		// 	.rotate(function() { return ~~(Math.random() * 2) * 90; })
		// 	.font("Impact")
		// 	.fontSize(function(d) { return d.size; })
		// 	.on('end', () => { this.drawWordCloud(); });

		this.histogram = new Histogram();
		this.book = null;
	}

	/** Updates the detail view with information in the book provided with the parent provided. */
	update(book, parent) {
		if (this.bookShown()) {
			this.close();
		}

		this.parent = parent;
		this.detailViewHolder = this.parent.append('div')
			.classed('row', true)
			.attr('id', 'detail-view-holder');
		this.book = book;

		d3.csv('assets/dataset/books/' + book.title.replace(/ /g, '_') + '.csv').then((data) => {
			this.bookData = data;
			this.cloudWords = this.extractWords(data);
			let imgDiv = this.detailViewHolder.append('div')
				.classed('col-md-4', true);

			imgDiv.append('h2').html(this.book.title);

			this.bookImage = imgDiv
				.append('img')
				.attr('src', 'assets/images/' + book.title + '.jpeg')
				.attr('alt', book.title)
				.classed('detail-view-book-img', true);

			// TODO: Add wordcloud
			this.wordCloudHolder = this.detailViewHolder.append('div')
				.classed('col-md-4', true);

			// this.cloud.words(this.cloudWords).start();

			let visHolder = this.detailViewHolder.append('div')
				.classed('col-md-4', true)
				.classed('detail-view-vis-holder', true);

			// Stacked bar chart of what we need to show to the user
			this.histogramHolder = visHolder.append('div');
			this.histogramHolder.append('h3')
				.attr('id', 'histogram-category-header');

			this.barSvg = this.histogramHolder.append('svg')
				.attr('width', this.dimensions.bars.width)
				.attr('height', this.dimensions.bars.height);

			this.histogram.update(this.bookData, visHolder);
			this.showCategory('starRating');

			let options = visHolder.append('select')
				.attr('id', 'histogram-category-selector')
				.selectAll('option')
				.data(this.histogram.categories)
				.enter()
				.append('option')
				.attr('value', (d) => d)
				.text((d) => d);

			options.filter((d) => { if (d === this.selectedCategory) return d; })
				.attr('selected', 'selected');

			let that = this;
			d3.select('#histogram-category-selector')
				.on('change', function(d, i) {
					let selection = this.options[this.selectedIndex].value;
					that.showCategory(selection);
				});
		});
	}

	/** Closes the detail view, removing it from the page. */
	close() {
		this.detailViewHolder.remove();
		this.book = null;
	}

	/** Helper method. Shows the category provided in the histogram and in the rest of the right column*/
	showCategory(category) {
		this.selectedCategory = category;
		let header = d3.select('#histogram-category-header');

		if (category === 'starRating') {
			header.text('Star Rating');
			this.drawStarsBar();
		} else if (category === 'verified') {
			header.text('Verified Reviews');
		} else if (category === 'year') {
			header.text('Reviews per year');
		} else if (category === 'isEBook') {
			header.text('Dead Tree vs. eBook')
		}

		this.histogram.drawCategory(this.selectedCategory);
	}

	/** Helper method. Draws the stars bar. */
	drawStarsBar() {
		let stars = this.getStars();
		let totalStars = d3.sum(stars);
		this.barSvg.selectAll('rect').remove();

		this.barSvg.selectAll('rect')
			.data(stars)
			.enter()
			.append('rect')
			.attr('x', (d, i) => {
				if (i === 0) {
					return 0;
				} else {
					let previous = stars.slice(0, i);
					let xPos = 0;
					previous.forEach((d) => { xPos += (d / totalStars) * this.dimensions.bars.width});
					return xPos;
				}
			})
			.attr('y', 0)
			.attr('width', (d, i) => {
				return (d / totalStars) * this.dimensions.bars.width;
			})
			.attr('height', this.dimensions.bars.height)
			.style('fill', (d, i) => {
				let r = 150 + (i * 18);
				let g = 140 + (i * 18);

				return 'rgb(' + r + ', ' + g + ', 0)';
			})
			.append('svg:title')
			.text((d, i) => { return (i + 1) + ' stars'; });
	}

	/** Helper method. Draws the verified bar.*/
	drawVerifiedBar() {

	}

	/** Helper method. Draws the reviews per year bar.*/
	drawReviewsBar() {

	}

	/** Helper method. Draws the eBook bar. */
	drawEBookBar() {

	}

	/** Helper method. Returns true if a book is shown. */
	bookShown() {
		if (this.book == null) {
			return false;
		} else {
			return true;
		}
	}

	/** Helper method. Extracts all the words from all of the reviews. */
	extractWords(data) {
		let replaceRegex = /\.\,\-\!\?><\\\#\$\&"/g;
		let splitRegex = /[\s,.-]/g;

		return data.map((r) => {
			let headlines = r.review_headline.replace(replaceRegex, ' ').toLowerCase().split(splitRegex).filter((w) => w);
			let body = r.review_body.replace(replaceRegex, ' ').toLowerCase().split(splitRegex).filter((w) => w);

			return headlines.concat.apply([], body);
		}).flat();
	}

	/** Helper method. Returns the stars data from the currently selected book. */
	getStars() {
		return [ this.book.one_star, this.book.two_stars, this.book.three_stars, this.book.four_stars, this.book.five_stars ];
	}

	drawWordCloud() {
		this.wordCloudHolder.append('svg')
			.attr('width', this.dimensions.cloud.width)
			.attr('height', this.dimensions.cloud.height)
			.append("g")
      		.attr("transform", "translate(" + this.dimensions.cloud.width / 2 + "," + this.dimensions.cloud.height / 2 + ")")
      		.selectAll('text')
      		.data(this.cloudWords)
      		.enter().append('text')
      		.style("font-size", function(d) { return d.size + "px"; })
			.style("font-family", "Impact")
			.attr("text-anchor", "middle")
			.attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			})
			.text(function(d) { return d.text; });
	}
}