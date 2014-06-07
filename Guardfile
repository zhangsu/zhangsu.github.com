guard :slim, output_root: 'deploy', slim: { pretty: false } do
  watch /^.+\.slim$/
end

guard :sass, output: 'deploy', style: :compressed do
  watch /^.+\.s[ac]ss$/
end

guard 'coffeescript', output: 'deploy' do
  watch /^.+\.coffee$/
end

js_file = 'deploy/index.js'
guard 'uglify', input: js_file, output: 'deploy/index.min.js' do
  watch js_file
end
