# Visualizing Amazon Reviews

Find the dataset [here](https://s3.amazonaws.com/amazon-reviews-pds/tsv/index.txt)

## Setup

1. Install ruby through whatever method you would like
2. Clone this repository
3. `gem install bundler && bundle install`
4. `bundle exec jekyll serve`

Access by navigating to `localhost:4000` on your machine.

## Dataset and Javascripts

Everything is in the `assets` directory--all stylesheets, dataset pieces, javascripts--everything should be included there.

## TODO

- [ ] The Scatterplot
	- [x] Miniature detail view shows information on mouse over
	- [x] Callbacks for the big detail view on selecting a book in the scatterplot
	- [x] Make the scatterplot control panel look nicer
	- [ ] Explore using color somehow in the scatterplot
	- [ ] Make the mouse-over detail panel show information in a nice way
	- [ ] Get the labels down and make them look good. Consider adding tick marks according to the current selection
- [ ] Big Detail View
	- [x] Figure out where it goes and how it should look
	- [x] Add a book cover
	- [x] Grab all of the data associated with the book
	- [ ] Visualize stars over time
	- [ ] Visualize verified purchases over time
	- [ ] Word cloud of all of the reviews
	- [ ] Consider pre-processing a lot of this work
	- [ ] Add a close button and hook it up to the overseer
	- [ ] 