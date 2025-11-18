# Detter App - Android构建脚本（使用Java 17）

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Detter App - Android构建" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 查找Java 17
$javaPaths = @(
    "D:\Software\PF\Java\jdk-17",
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-17.0.1",
    "C:\Program Files\Java\jdk-17.0.2",
    "C:\Program Files\Java\jdk-17.0.3",
    "C:\Program Files\Java\jdk-17.0.4",
    "C:\Program Files\Java\jdk-17.0.5",
    "C:\Program Files\Java\jdk-17.0.6",
    "C:\Program Files\Java\jdk-17.0.7",
    "C:\Program Files\Java\jdk-17.0.8",
    "C:\Program Files\Java\jdk-17.0.9",
    "C:\Program Files\Java\jdk-17.0.10",
    "C:\Program Files\Eclipse Adoptium\jdk-17",
    "C:\Program Files\Eclipse Foundation\jdk-17"
)

$javaFound = $false
foreach ($path in $javaPaths) {
    if (Test-Path "$path\bin\java.exe") {
        $env:JAVA_HOME = $path
        $env:PATH = "$path\bin;$env:PATH"
        $javaFound = $true
        Write-Host "[找到] Java 17: $path" -ForegroundColor Green
        break
    }
}

if (-not $javaFound) {
    Write-Host "[错误] 未找到Java 17" -ForegroundColor Red
    Write-Host ""
    Write-Host "请确保Java 17已安装" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[验证] Java版本:" -ForegroundColor Yellow
& java -version
Write-Host ""

Write-Host "[清理] Gradle缓存..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches" -ErrorAction SilentlyContinue

Write-Host "[清理] Android构建..." -ForegroundColor Yellow
Set-Location android
& .\gradlew clean
Set-Location ..

Write-Host ""
Write-Host "[构建] 开始构建Android应用..." -ForegroundColor Cyan
Write-Host "这可能需要3-5分钟，请耐心等待..." -ForegroundColor Yellow
Write-Host ""

& npm run android

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "  构建成功！" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "应用应该已经安装到你的设备上了" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Red
    Write-Host "  构建失败" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "请检查上面的错误信息" -ForegroundColor Yellow
}
