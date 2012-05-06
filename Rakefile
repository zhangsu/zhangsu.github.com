task :deploy do |; dir|
  dir = 'deploy'
  unless File.directory? dir
    puts 'Nothing to deploy. Exiting.'
    next
  end
  puts 'Deploying...'
  sh <<-COMMAND
    git checkout master &&\
    cp #{dir}/* . &&\
    git commit . -m "Deploy branch 'source' to GitHub pages &&\
    git push origin master &&\
    git checkout source
  COMMAND
  puts 'Done.'
end