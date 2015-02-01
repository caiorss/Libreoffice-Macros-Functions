#!/bin/bash
#
# https://gist.github.com/fintanmm/9272299
#
# LibreOffice headless server script
#
#
# chkconfig: 2345 80 30
# description: headless openoffice server script
# processname: libreoffice
#
# Author: Vic Vijayakumar
# Modified by Federico Ch. Tomasczik
#          and then by Mark Pavlichuk
# Mostly a rewrite
#
DAEMON=/usr/bin/soffice
UserInstallation="file:///mnt/alfresco/alf_data/oouser"
DAEMON_WHOME="$DAEMON -env:UserInstallation=$UserInstallation"
OPTS="--headless --nologo --nofirststartwizard --norestore --accept=\"socket,host=libreoffice,port=8100;urp\" & > /dev/null 2>&"
PIDFILE=/var/run/libreoffice-server.pid
USER=tomcat7

set -e

# Exit if the package is not installed
[ -x "$DAEMON" ] || exit 0

case "$1" in
  start)
    if [ $(pidof -x soffice | wc -w) -gt 2 ]; then
      echo "Daemon running: LibreOffice headless"
      exit
    fi
    echo "Starting daemon: LibreOffice headless"
    start-stop-daemon --start --chuid "$USER" --quiet --pidfile $PIDFILE --exec "$DAEMON_WHOME" -- "$OPTS"
  ;;
  status)
    if [ $(pidof -x soffice | wc -w) -gt 2 ]; then
      echo "Daemon running: LibreOffice headless"
    else
      echo "Daemon not running: LibreOffice headless"
    fi
  ;;
  stop)
    echo "Stopping daemon: LibreOffice headless"
    if [ $(pidof -x soffice | wc -w) -gt 2 ]; then
      start-stop-daemon --stop --chuid "$USER" --pidfile "$PIDFILE" --exec "$DAEMON_WHOME" -- "$OPTS"
      exit
    fi
    exit
  ;;
  restart)
    echo "Restarting daemon: LibreOffice headless"
    start-stop-daemon --stop --quiet --oknodo --retry 30 --pidfile $PIDFILE
    start-stop-daemon --start --chuid "$USER" --quiet --pidfile $PIDFILE --exec "$DAEMON_WHOME" -- "$OPTS"
    echo "."
  ;;
  *)
    echo "Usage: $0 {start|status|restart|stop}"
    exit 1
  esac
exit 0
