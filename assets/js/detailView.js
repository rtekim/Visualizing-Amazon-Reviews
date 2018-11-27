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

		// this.cloud = d3.layout.cloud()
		// 	.size([this.dimensions.cloud.width, this.dimensions.cloud.height ])
		// 	.rotate(function() { return ~~(Math.random() * 2) * 90; })
		// 	.font("Impact")
		// 	.fontSize(function(d) { return d.size; })
		// 	.on('end', () => { this.drawWordCloud(); });

		this.book = null;
	}

	/** Updates the detail view with information in the book provided with the parent provided. */
	update(book, parent) {
		if (this.bookShown()) {
			this.close();
		}

		this.parent = parent;
		this.detailViewHolder = this.parent.append('div')
			.attr('id', 'detail-view-holder');

		d3.csv('assets/dataset/books/' + book.title.replace(/ /g, '_') + '.csv').then((data) => {
			this.bookData = data;
			this.cloudWords = this.extractWords(data);

			this.bookImage = this.detailViewHolder.append('div')
				.classed('col-md-4', true)
				.append('img')
				.attr('src', 'assets/images/' + book.title + '.jpeg')
				.attr('alt', book.title)
				.classed('detail-view-book-img', true);

			// TODO: Add wordcloud
			this.wordCloudHolder = this.detailViewHolder.append('div')
				.classed('col-md-4', true);

			// this.cloud.words(this.cloudWords).start();

			let visHolder = this.detailViewHolder.append('div')
				.classed('col-md-4', true);

			// TODO: Stars stacked bar chart
			let starsHolder = visHolder.append('div');

			// TODO: Reviews stacked bar chart
			let reviewsHolder = visHolder.append('div');

			this.book = book;
		});
	}

	/** Closes the detail view, removing it from the page. */
	close() {
		this.detailViewHolder.remove();
		this.book = null;
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