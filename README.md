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

- [ ] Aggregate the data
    - [ ] Add header to all of the various CSV files for each of the books
    - [ ] Change the files to make them CSV rather "\t" separated
    - [ ] Create one file for each book that has averages for each year that a review was given