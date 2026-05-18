$src = "D:\fleet images\GMC"
$dest = "d:\with data base\Al aqsa web\transport\public\images\fleet\gmc-yukon"
New-Item -ItemType Directory -Force -Path $dest

$images = @{
    "gmc-yukon-xl-family-seating-makkah-to-madinah-taxi.jpeg" = "gmc-yukon-family-seating-makkah-madinah-taxi.jpeg"
    "gmc-yukon-xl-front-grille-jeddah-to-makkah-transport.jpeg" = "gmc-yukon-front-grille-jeddah-makkah-transport.jpeg"
    "gmc-yukon-xl-front-headlight-umrah-cab.jpeg" = "gmc-yukon-front-headlight-umrah-cab.jpeg"
    "gmc-yukon-xl-full-exterior-view-umrah-taxi-service.jpeg" = "gmc-yukon-exterior-vip-umrah-taxi.jpeg"
    "gmc-yukon-xl-full-rear-view-family-umrah-cab.jpeg" = "gmc-yukon-rear-view-family-umrah-cab.jpeg"
    "gmc-yukon-xl-highway-driving-makkah-to-madinah.jpeg" = "gmc-yukon-highway-driving-makkah-madinah.jpeg"
    "gmc-yukon-xl-led-headlights-makkah-transport.jpeg" = "gmc-yukon-led-headlights-makkah-transport.jpeg"
    "gmc-yukon-xl-luggage-capacity-jeddah-airport-transfer.jpeg" = "gmc-yukon-luggage-capacity-jeddah-airport.jpeg"
    "gmc-yukon-xl-luxury-umrah-transport-cinematic.jpeg" = "gmc-yukon-luxury-umrah-transport-cinematic.jpeg"
    "gmc-yukon-xl-panoramic-sunroof-luxury-umrah-transport.jpeg" = "gmc-yukon-panoramic-sunroof-luxury.jpeg"
    "gmc-yukon-xl-premium-alloy-wheels-umrah-cab.jpeg" = "gmc-yukon-premium-alloy-wheels-umrah-cab.jpeg"
    "gmc-yukon-xl-premium-dashboard-interior-umrah-taxi.jpeg" = "gmc-yukon-premium-dashboard-interior.jpeg"
    "gmc-yukon-xl-rear-view-umrah-cab-saudi-arabia.jpeg" = "gmc-yukon-rear-view-umrah-cab-saudi.jpeg"
    "gmc-yukon-xl-side-profile-vip-umrah-taxi.jpeg" = "gmc-yukon-side-profile-vip-umrah-taxi.jpeg"
    "gmc-yukon-xl-umrah-taxi-tail-lights-makkah.jpeg" = "gmc-yukon-umrah-taxi-tail-lights-makkah.jpeg"
    "gmc-yukon-xl-vip-passenger-seats-umrah-transport.jpeg" = "gmc-yukon-vip-passenger-seats-umrah.jpeg"
}

foreach ($key in $images.Keys) {
    Copy-Item -Path "$src\$key" -Destination "$dest\$($images[$key])" -Force
}
