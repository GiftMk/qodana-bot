# PowerShell script to zip dist/index.js and external.txt for AWS Lambda deployment
$sourceFiles = @(
    "dist/**",
    "qodana-setup-bot.2025-11-16.private-key.pem",
    "templates"
)
$zipPath = "terraform/lambda.zip"

# Remove existing zip if present
if (Test-Path $zipPath) {
    Remove-Item $zipPath
}

Compress-Archive -Path $sourceFiles -DestinationPath $zipPath
Write-Host "Created $zipPath with $($sourceFiles.Count) files."