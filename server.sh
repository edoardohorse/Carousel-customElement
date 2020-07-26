#!/bin/bash

address=`ifconfig | grep -oE "192.168.0.[0-9]{2} "`

python3 -m http.server 8080 --bind $address 