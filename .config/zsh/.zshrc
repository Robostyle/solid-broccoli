##
## Configuration
##

while read file
do
    source "$ZDOTDIR/$file.zsh"
done <<-EOF
env
aliases
utility
options
plugins
key-bindings
prompt
EOF

# vim: ft=zsh ts=4 sw=4 expandtab nowrap
