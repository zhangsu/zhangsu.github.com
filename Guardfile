guard :haml, output: 'deploy', haml_options: { ugly: true } do
  watch /^.+(\.html\.haml)$/
end

guard :sass, output: 'deploy', extension: '', style: :compressed do
  watch /^.+(\.css\.s[ac]ss)$/
end

guard 'coffeescript', output: 'deploy' do
  watch /^.+(\.js\.coffee)$/
end

guard 'uglify', :destination_file => "deploy/index.js" do
  watch 'deploy/index.js'
end
