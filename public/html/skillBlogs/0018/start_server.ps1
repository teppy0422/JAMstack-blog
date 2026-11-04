# Presentation local server (same mechanism as 44_SSC / 56 start_server.ps1)
# Serves this folder at http://localhost:8083/ so the embedded SSC / navi pages work as they do on the server.
# Closing this window stops the server.
$root = $PSScriptRoot
$port = 8083
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
} catch {
    Write-Host "Failed to start. Port $port may already be in use." -ForegroundColor Red
    Write-Host $_.Exception.Message
    Read-Host "Press Enter to exit"
    exit
}
Write-Host "Server started: http://localhost:$port/" -ForegroundColor Green
Write-Host "Closing this window stops the server. Press Ctrl+C to stop."
Write-Host ""
Start-Process "http://localhost:$port/index.html"
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".json" = "application/json; charset=utf-8"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
    ".wav"  = "audio/wav"
    ".mp3"  = "audio/mpeg"
    ".mp4"  = "video/mp4"
    ".ttf"  = "font/ttf"
    ".woff" = "font/woff"
    ".woff2" = "font/woff2"
    ".pdf"  = "application/pdf"
}
$fullRoot = (Resolve-Path $root).Path
while ($listener.IsListening) {
    $context = $null
    try {
        $context = $listener.GetContext()
    } catch {
        break
    }
    $request = $context.Request
    $response = $context.Response
    try {
        $absPath = $request.Url.AbsolutePath
        $relPath = [Uri]::UnescapeDataString($absPath.TrimStart('/'))
        if ($relPath -eq '__listdir' -or $relPath.EndsWith('/__listdir')) {
            # Folder names next to the product folders (used by SSC findProductFolder: ../__listdir)
            $dirRel = $relPath.Substring(0, $relPath.Length - '__listdir'.Length)
            $dirPath = [System.IO.Path]::GetFullPath((Join-Path $root $dirRel))
            $dirs = @()
            if ($dirPath.StartsWith($fullRoot) -and (Test-Path $dirPath -PathType Container)) {
                $dirs = Get-ChildItem -Path $dirPath -Directory | Select-Object -ExpandProperty Name
            }
            $escaped = $dirs | ForEach-Object { [char]34 + $_ + [char]34 }
            $json = "[" + ($escaped -join ",") + "]"
            $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $jsonBytes.Length
            $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
        } else {
            if ([string]::IsNullOrEmpty($relPath) -or $relPath.EndsWith('/')) { $relPath = $relPath + "index.html" }
            $filePath = Join-Path $root $relPath
            $fullFile = [System.IO.Path]::GetFullPath($filePath)
            if ($fullFile.StartsWith($fullRoot) -and (Test-Path $fullFile -PathType Leaf)) {
                $ext = [System.IO.Path]::GetExtension($fullFile).ToLower()
                $contentType = $mimeTypes[$ext]
                if (-not $contentType) { $contentType = "application/octet-stream" }
                $response.ContentType = $contentType
                $bytes = [System.IO.File]::ReadAllBytes($fullFile)
                $response.ContentLength64 = $bytes.Length
                if ($request.HttpMethod -ne 'HEAD') {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $response.ContentType = "text/plain; charset=utf-8"
                $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
                $response.ContentLength64 = $notFoundBytes.Length
                if ($request.HttpMethod -ne 'HEAD') {
                    $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                }
            }
        }
    } catch {
        try { $response.StatusCode = 500 } catch {}
    } finally {
        try { $response.OutputStream.Close() } catch {}
    }
}
