#!/usr/bin/env sh

makoctl reload

notify-send \
	-a "Test notify app" \
	-i chromium \
	-t 5000 \
	"Here is some summary" "needed to <s>create</s> that script cuz /usr/bin/makoctl reload wasn't working and was preventing the notification to appear with no logs"
