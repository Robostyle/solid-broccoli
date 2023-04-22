##
## Aliases
##

# extra arguments for containers
extra_ssh_args="-v $HOME/.ssh:/home/vscode/.ssh"
extra_yocto_args="-v devcontainer_home:/home ${extra_ssh_args}"

alias ls="exa --color=auto --icons"
alias l="ls -l"
alias la="ls -a"
alias lla="ls -la"
alias lt="ls --tree"

alias grep="grep --color=auto"

# git Aliases
#
alias cbr="git branch --sort=-committerdate | fzf --header "Checkout Recent Branch" --preview "git diff {1} --color=always" --pointer="" | xargs git checkout"
alias gfa="git fetch --all -p"
alias git_authors="git for-each-ref --format='%(objecttype);%(refname);%(committername);%(committerdate)' --sort=committer refs/remotes/origin/"
alias gst="git status"
alias lg="lazygit"

# board development
#
alias ctembedded='run_docker siqura/buildtools:1.1'
alias ctembedded2012='run_docker siqura/buildtools:3.4'
alias cthardknott="run_docker ${extra_yocto_args} yocto/hardknott"

alias board_devel="tmuxp load yocto"

alias ..="cd .."
alias ..2="cd ../.."
alias ..3="cd ../../.."
alias ..4="cd ../../../.."
alias ..5="cd ../../../../.."
alias ..6="cd ../../../../../.."
alias ..7="cd ../../../../../../.."

alias sudo='sudo '

alias yeet='yay -Rcs'

# alias run_diamond="sudo modprobe dummy && sudo ip link add bond0 type dummy && sudo ifconfig bond0 hw ether 10:22:33:44:55:66"

# vim:expandtab:ts=4:sw=4

