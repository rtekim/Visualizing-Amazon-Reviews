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
	- [ ] Callbacks for the big detail view on selecting a book in the scatterplot
	- [x] Make the scatterplot control panel look nicer
	- [ ] Explore using color somehow in the scatterplot
	- [ ] Make the mouse-over detail panel show information in a nice way
- [ ] Big Detail View
	- [ ] Figure out where it goes and how it should look
	- [ ] Add a book cover
	- [ ] Word cloud of all of the reviews