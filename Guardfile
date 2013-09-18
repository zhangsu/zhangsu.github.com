guard :haml, output: 'deploy', haml_options: { ugly: true } do
  watch /^.+\.haml$/
end

guard :sass, output: 'deploy', style: :compressed do
  watch /^.+\.s[ac]ss$/
end

guard 'coffeescript', output: 'deploy' do
  watch /^.+\.coffee$/
end

guard 'uglify', :destination_file => "deploy/index.js" do
  watch 'deploy/index.js'
end
