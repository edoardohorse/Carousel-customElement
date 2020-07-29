$ipaddress = Get-NetIPAddress | ForEach-Object{ if($_.PrefixOrigin -eq 'Dhcp'){ return $_} }

Start "http://$($ipaddress.IPAddress)"
python -m http.server 8080 --bind $ipaddress.IPAddress
