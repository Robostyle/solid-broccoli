##
## Plugins
##

# Configure and load plugins using Zinit's
ZINIT_HOME="${ZINIT_HOME:-${XDG_DATA_HOME:-${HOME}/.local/share}/zinit}"

if [[ ! -f ${ZINIT_HOME}/zinit.git/zinit.zsh ]]; then
    print -P "%F{14}▓▒░ Installing Flexible and fast ZSH plugin manager %F{13}(zinit)%f"
    command mkdir -p "${ZINIT_HOME}" && command chmod g-rwX "${ZINIT_HOME}"
    command git clone https://github.com/zdharma-continuum/zinit.git "${ZINIT_HOME}/zinit.git" && \
        print -P "%F{10}▓▒░ Installation successful.%f%b" || \
        print -P "%F{9}▓▒░ The clone has failed.%f%b"
fi

source "${ZINIT_HOME}/zinit.git/zinit.zsh"

zinit ice blockf atpull'zinit creinstall -q .'
zinit light zsh-users/zsh-completions

autoload compinit
compinit

zinit light-mode for \
    hlissner/zsh-autopair \
    zdharma-continuum/fast-syntax-highlighting \
    MichaelAquilina/zsh-you-should-use \
    zsh-users/zsh-autosuggestions \
    Aloxaf/fzf-tab

zinit snippet OMZ::plugins/git/git.plugin.zsh
zinit ice wait'3' lucid
zinit light zsh-users/zsh-history-substring-search

zinit ice wait'2' lucid
zinit light zdharma-continuum/history-search-multi-word

zinit ice from"gh-r" as"program"
zinit light junegunn/fzf
zinit light-mode for \
  id-as'fzf/completion' https://github.com/junegunn/fzf/blob/master/shell/completion.zsh \
  id-as'fzf/key-bindings' https://github.com/junegunn/fzf/blob/master/shell/key-bindings.zsh

zinit ice wait'3' lucid
zinit light agkozak/zsh-z

zinit wait lucid light-mode for "lukechilds/zsh-nvm"

# tmux {{{
zstyle ':prezto:module:tmux:session' name '0'
zinit ice svn; zinit snippet PZT::modules/tmux
zinit ice lucid wait'!0a' as'null' id-as'tpm' atclone'mkdir -p $HOME/.tmux/plugins; ln -sf $ZINIT[PLUGINS_DIR]/tpm $HOME/.tmux/plugins/tpm' ; zinit light tmux-plugins/tpm
# }}}

# vim: ft=zsh ts=4 sw=4 expandtab

