# Build the single-file game (dist/index.html) for itch.io / Steam from src/ + assets/.
# Usage:  powershell -ExecutionPolicy Bypass -File build.ps1        (add -Zip to also make the itch upload zip)
param([switch]$Zip)
$ErrorActionPreference='Stop'
$root=Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8=New-Object Text.UTF8Encoding $false
$tpl=[IO.File]::ReadAllText("$root\index.template.html",$utf8)
$js=(Get-ChildItem "$root\src" -Filter *.js | Sort-Object Name | ForEach-Object { [IO.File]::ReadAllText($_.FullName,$utf8) }) -join ''
$out=$tpl.Replace('@@SRC@@',$js)
$out=[regex]::Replace($out,'@@asset:([a-z0-9]+/[a-z0-9+.-]+)@([^@]+)@@',{
  param($m) $p=Join-Path $root $m.Groups[2].Value
  if(-not (Test-Path $p)){ throw "Missing asset: $($m.Groups[2].Value)" }
  'data:'+$m.Groups[1].Value+';base64,'+[Convert]::ToBase64String([IO.File]::ReadAllBytes($p)) })
New-Item -ItemType Directory -Force "$root\dist" | Out-Null
[IO.File]::WriteAllText("$root\dist\index.html",$out,$utf8)
"Built dist/index.html ($([math]::Round($out.Length/1MB,2)) MB)"
if($Zip){ $z="$root\dist\junttycoon-itch.zip"; if(Test-Path $z){Remove-Item $z}; Compress-Archive -Path "$root\dist\index.html" -DestinationPath $z; "Built $z" }
