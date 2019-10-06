#!/bin/bash

SCRIPT=devrelbot.py
BOTDIR=~/Kristal/devrel-tools/slackbots/botlib-bots/devrelbot
PYTHON=/opt/clover/pyre/bin/python
cd ${BOTDIR}

REFRESH=$(git fetch --all)
UPSTREAM=${1:-'@{u}'}
REMOTE=$(git rev-parse "$UPSTREAM")
LOCAL=$(git rev-parse @)
BASE=$(git merge-base @ "$UPSTREAM")


function pgrep() {
    ps aux | grep $1 | grep -v grep
}

function pkill() {
    local pid
    pid=$(ps ax | grep $2 | grep -v grep | awk '{ print $1}')
    kill $1 ${pid}
    echo "Killed $2 (process $pid)"
}

if ! pgrep ${SCRIPT} > /dev/null; then
    echo "${SCRIPT} is not running"
    cd ${BOTDIR}
    exec /bin/nice -19 ${PYTHON} ${SCRIPT} >/dev/null &
fi

if [ ! ${LOCAL} = ${REMOTE} ]; then
    echo "New changes, picking up dropins"
    cd ${BOTDIR}
    git reset --hard origin/master
    pkill -HUP ${SCRIPT}
    #exec ${PYTHON} ${SCRIPT} > /dev/null *&
fi


