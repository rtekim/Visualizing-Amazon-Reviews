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

## Bugs

- [ ] Missing some books:
	```
	[2018-11-27 19:16:48] ERROR `/assets/images/Watchmen.jpeg' not found.
	[2018-11-27 19:16:53] ERROR `/assets/images/Ubik.jpeg' not found.
	[2018-11-27 19:17:04] ERROR `/assets/images/Neuromancer.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Watchmen.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Lolita.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Falconer.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Are You There God' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Atonement.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Neuromancer.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Beloved.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Ragtime.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Money.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Housekeeping.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Loving.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Herzog.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Ubik.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Deliverance.jpeg' not found.
	[2018-11-27 19:17:27] ERROR `/assets/images/Possession.jpeg' not found.
	```
- [ ] Selecting the book grid and then going back to the table only appends the table--it does not remove the book grid