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


# Runs docker in my work space with given image
function run_docker() {
    if [ $# -lt 1 ]; then
        echo "Not enough arguments, usage: run_docker [options] <image>[:<tag>]"
    else
        dcmd="docker run -ti --rm -v $HOME/work:/workspaces -w /workspaces $@"
        echo ${dcmd}
        eval ${dcmd}
    fi
}


# Performs a bmap copy to a mounted UMS disk.
function bmapcopy() {
    if [ $# -lt 1 ]; then
        echo "No argument given, need a filename to a .wic file"
    else
        bmaptool copy $1 /dev/disk/by-id/$(ls /dev/disk/by-id | grep -E '^usb-Linux_UMS_disk_0_[0-9a-z]{,18}-0:0$')
    fi
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

