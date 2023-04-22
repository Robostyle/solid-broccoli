# only one instance
if pgrep wlogout; then
	exit 1
fi

resolution=$(xrandr --current | sed -n 's/.* connected \([0-9]*\)x\([0-9]*\)+.*/\1x\2/p')
w=${resolution%x*}
h=${resolution#*x}

margin_lr=$((($w - 600) / 2))
margin_tb=$((($h - 480) / 2))

wlogout -L$margin_lr -R$margin_lr -T$margin_tb -B$margin_tb -p layer-shell
