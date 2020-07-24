#!/bin/bash

port=`ifconfig | grep -o "192.168.0.[0-9] "`

python3 -m http.server 8080 --bind $port 