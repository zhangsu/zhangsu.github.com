guard :haml, output: 'deploy', haml_options: { ugly: true } do
  watch /^.+(\.html\.haml)$/
end

guard :sass, output: 'deploy', extension: '', style: :compressed do
  watch /^.+(\.css\.s[ac]ss)$/
end
