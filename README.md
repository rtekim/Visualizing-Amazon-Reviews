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
	- [ ] Make the scatterplot bigger, putting the details and control panel on the bottom. Turns out our dataset is highly clustered.