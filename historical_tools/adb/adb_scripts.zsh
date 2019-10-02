######
# ADB
######
adb_screen() {
	if [ $# -eq 0 ]
	then
		name="screenshot.png"
	else
		name="$1.png"
	fi
	adb shell screencap -p /sdcard/$name
	adb pull /sdcard/$name
	adb shell rm /sdcard/$name
	curr_dir=pwd
	echo "Saved to `pwd`/$name"
}

adb_record() {
	# name of file
	if [ $1 -eq 0 ]
	then
		name="video.mp4"
	else
		name="$1.mp4"
	fi

	# time to record
	if [ $2 -eq 0 ]
	then
		time_limit=180
	else
		time_limit=$2
	fi

	adb shell screenrecord /sdcard/$name --time-limit $time_limit
	adb pull /sdcard/$name
	adb shell rm /sdcard/$name
	curr_dir=pwd
	echo "Saved to `pwd`/$name"
}