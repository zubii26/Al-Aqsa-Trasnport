$sourceDir = "d:\fleet images\staria"
$destDir = "d:\with data base\Al aqsa web\transport\public\images\fleet\hyundai-staria"

if (!(Test-Path -Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

$mapping = @{
    "back door.jpeg" = "hyundai-staria-back-door-umrah-taxi.jpeg"
    "back full.jpeg" = "hyundai-staria-full-rear-view-taxi.jpeg"
    "back light.jpeg" = "hyundai-staria-taillight-detail.jpeg"
    "back seats.jpeg" = "hyundai-staria-rear-seats-passenger-space.jpeg"
    "cenimatic.jpeg" = "hyundai-staria-cinematic-night-view.jpeg"
    "dashboaed 2.jpeg" = "hyundai-staria-dashboard-angle.jpeg"
    "dashboard.jpeg" = "hyundai-staria-dashboard-interior-view.jpeg"
    "front.jpeg" = "hyundai-staria-front-grille-makkah-taxi.jpeg"
    "fronts.jpeg" = "hyundai-staria-front-view.jpeg"
    "ful front.jpeg" = "hyundai-staria-full-front-profile.jpeg"
    "full sataria.jpeg" = "hyundai-staria-full-exterior.jpeg"
    "head l.jpeg" = "hyundai-staria-headlight-design.jpeg"
    "head light.jpeg" = "hyundai-staria-led-headlight.jpeg"
    "ligh combo.jpeg" = "hyundai-staria-light-combo.jpeg"
    "open dooe.jpeg" = "hyundai-staria-open-door-interior-access.jpeg"
    "roof top.jpeg" = "hyundai-staria-roof-view.jpeg"
    "seat.jpeg" = "hyundai-staria-vip-leather-seat.jpeg"
    "seats.jpeg" = "hyundai-staria-spacious-passenger-seating.jpeg"
    "side.jpeg" = "hyundai-staria-side-profile.jpeg"
    "side1.jpeg" = "hyundai-staria-side-exterior-view.jpeg"
    "staria back.jpeg" = "hyundai-staria-rear-trunk-space.jpeg"
    "staria desert raod.jpeg" = "hyundai-staria-desert-road-trip.jpeg"
    "staria road full.jpeg" = "hyundai-staria-highway-drive-makkah-madinah.jpeg"
    "wheel 2.jpeg" = "hyundai-staria-alloy-wheel-design.jpeg"
    "wheel.jpeg" = "hyundai-staria-wheel-detail.jpeg"
}

foreach ($key in $mapping.Keys) {
    $sourcePath = Join-Path $sourceDir $key
    $destPath = Join-Path $destDir $mapping[$key]
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "Copied $key to $($mapping[$key])"
    } else {
        Write-Host "File not found: $sourcePath" -ForegroundColor Red
    }
}
Write-Host "Done!"
