# Replace all hardcoded Render URLs with localhost
$oldUrl = "https://vetician-backend-kovk.onrender.com/api"
$newUrl = "http://localhost:3000/api"

$oldSocketUrl = "https://vetician-backend-kovk.onrender.com"
$newSocketUrl = "http://localhost:3000"

# Get all JS and JSX files excluding node_modules
$files = Get-ChildItem -Path . -Include *.js,*.jsx -Recurse | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.expo" }

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace API URLs
    $content = $content -replace [regex]::Escape($oldUrl), $newUrl
    $content = $content -replace [regex]::Escape($oldSocketUrl), $newSocketUrl
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
        $count++
    }
}

Write-Host "`nTotal files updated: $count"
