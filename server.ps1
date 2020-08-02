$ipaddress = Get-NetIPAddress | ForEach-Object{ if($_.PrefixOrigin -eq 'Dhcp'){ return $_} }

Start "http://$($ipaddress.IPAddress)"
python -m http.server 80 --bind $ipaddress.IPAddress
