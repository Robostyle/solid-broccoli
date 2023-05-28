##
## Utility functions
##

function _smooth_fzf() {
    local fname
    local current_dir="$PWD"
    cd "${XDG_CONFIG_HOME:-~/.config}"
    fname="$(fzf)" || return
    $EDITOR "$fname"
    cd "$current_dir"
}


# launches gstreamer connecting to a RTSP stream.
# arg1 ip address
# arg2 (optional) different media url
function gst-launch() {
    local arg_count=$#
    if [ $arg_count -lt 1 ]; then
        echo "Need ip address of RTSP source"
    elif [ $arg_count -eq 1 ]; then
        echo "gst-launch-1.0 playbin uri=rtsp://$1/video-1.encoder-1 uridecodebin0::source::latency=100 video-sink='fpsdisplaysink'"
        gst-launch-1.0 playbin uri=rtsp://$1/video-1.encoder-1 uridecodebin0::source::latency=100 video-sink="fpsdisplaysink"
    else
        echo "gst-launch-1.0 playbin uri=rtsp://$1/$2 uridecodebin0::source::latency=100 video-sink='fpsdisplaysink'"
        gst-launch-1.0 -vvv playbin uri=rtsp://$1/$2 uridecodebin0::source::latency=100 video-sink="fpsdisplaysink"
    fi
}


# performs a sudo on an zsh alias/function.
function zsudo() sudo zsh -c "$functions[$1]" "$@"

# vim: ft=zsh ts=4 sw=4 expandtab

