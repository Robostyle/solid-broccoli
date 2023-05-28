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

function sqrfw_upload() {
    if [ $# -lt 1 ]; then
        echo "Need an IP address, usage: sqrfw_upload <ip-address> [firmware-file]"
    else
        local firmware_basepath="/$HOME/work/codec_firmware_root/build/tmp/deploy/images/ithaca"
        local firmware_file="image=@${firmware_basepath}/ithaca-image-ithaca_norules.sqrfw"
        local ip_address="$1"

        if [ $# -eq 2 ]; then
            firmware_file="image=@${firmware_basepath}/$2"
        fi

        echo "Uploading firmware '${firmware_file}'"

        curl http://${ip_address}/firmware/upgrade.cgi?response=json -v -F ${firmware_file}
    fi


}


