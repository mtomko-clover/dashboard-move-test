#!/bin/bash
# Have seen situations where the SSL connection to slack goes into a loop and spins, consuming CPU.
# Added this to crontab to restart every 4 hours
# 0 */4 * * * /home/joel.mcintyre/{...}/devrel-tools/slackbots/botlib-bots/devrelbot/scripts/restart_devrelbot.sh
SCRIPT=devrelbot.py
BOTDIR=~/Kristal/devrel-tools/slackbots/botlib-bots/devrelbot
PYTHON=/opt/clover/pyre/bin/python
cd ${BOTDIR}

function pgrep() {
    ps aux | grep $1 | grep -v grep
}

function pkill() {
    local pid
    pid=$(ps ax | grep   $1 | grep -v grep | awk '{ print $1}')
    kill ${pid}
    echo "Killed $1 (process $pid)"
}

if ! pgrep ${SCRIPT} > /dev/null; then
    echo "${SCRIPT} is not running"
    cd ${BOTDIR}
    exec /bin/nice -19 ${PYTHON} ${SCRIPT} >/dev/null &
else
    cd ${BOTDIR}
    pkill ${SCRIPT}
fi
