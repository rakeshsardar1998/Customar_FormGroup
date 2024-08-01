#!/bin/sh
pgrep -f /bin/www.js | xargs -i{} kill -9 {}
