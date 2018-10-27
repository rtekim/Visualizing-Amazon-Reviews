Dir['*.txt'].each do |file|
  `mv #{file} #{file.gsub('.txt', '.csv')}`
end
