# generate_overview.rb
#
# Generates an overview using each of the books in the books directory
require 'csv'

keys = 'marketplace,customer_id,review_id,product_id,product_parent,product_title,product_category,star_rating,helpful_votes,total_votes,vine,verified_purchase,review_headline,review_body,review_date'.split(',').map { |a| a.to_sym }

collection = []
overview_keys_str = 'title,total_reviews,book_reviews,ebook_reviews,verified_reviews,five_stars,four_stars,three_stars,two_stars,one_star,average_helpful'
overview_keys = 'total_reviews,book_reviews,ebook_reviews,verified_reviews,five_stars,four_stars,three_stars,two_stars,one_star,average_helpful'.split(',').map {|a| a.to_sym}

Dir['books/**.csv'].each do |file|
  herp = CSV.read(file).map { |a| Hash[keys.zip(a)]}
  row = {}
  
  if herp.size == 1
    row[:title] = file.gsub('_', ' ').gsub('books/', '')
    overview_keys.each {|k| row[k] = 0}
    collection << row
    next
  end

  # Let's gather everything that we need to and generate our collection
  row[:title] = herp[1][:product_title]
  row[:total_reviews] = herp.size - 1

  row[:book_reviews] = 0
  row[:ebook_reviews] = 0
  row[:verified_reviews] = 0
  row[:five_stars] = 0
  row[:four_stars] = 0
  row[:three_stars] = 0
  row[:two_stars] = 0
  row[:one_star] = 0
  
  helpful_votes = 0
  total_votes = 0
  
  first_line_flag = false
  herp.each do |review|
    unless first_line_flag
      first_line_flag = true
      next
    end

    review[:product_category].strip == 'Books' ? row[:book_reviews] += 1 : row[:ebook_reviews] += 1
    row[:verified_reviews] += 1 if review[:verified_purchase] == 'Y'

    stars = review[:star_rating].to_i
    case stars
    when 5
           row[:five_stars] += 1
    when 4
           row[:four_stars] += 1
    when 3
           row[:three_stars] += 1
    when 2
           row[:two_stars] += 1
    when 1
           row[:one_star] += 1
    end

    helpful_votes += review[:helpful_votes].to_i
    total_votes += review[:total_votes].to_i
  end

  row[:average_helpful] = helpful_votes.to_f / total_votes.to_f

  collection << row
end

output = CSV.generate { |csv| collection.each { |a| csv << a.values } }
File.open('books_overview.csv', 'w') {|f| f.puts overview_keys_str ; f.puts output }
