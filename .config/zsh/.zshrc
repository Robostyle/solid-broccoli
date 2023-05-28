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

if [[ -f "$ZDOTDIR/utility-work.zsh" ]]; then
    echo "Sourcing work utilities"
    source "$ZDOTDIR/utility-work.zsh"
fi

# vim: ft=zsh ts=4 sw=4 expandtab nowrap
