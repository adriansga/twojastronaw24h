$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
  $script:folder = $folder
  $script:pendingChanges = @()

  Write-Host "AUTOPUSH aktywny - czekam na zmiany..." -ForegroundColor Green
  Write-Host "Zamknij okno zeby zatrzymac." -ForegroundColor Yellow

  $watcher = New-Object System.IO.FileSystemWatcher
  $watcher.Path = $folder
  $watcher.IncludeSubdirectories = $false
  $watcher.EnableRaisingEvents = $true
  $watcher.Filter = "*.*"

  $action = {
      $name = $Event.SourceEventArgs.Name
      if ($name -match '^\.' -or $name -match '~\$' -or $name -match '\.tmp$' -or $name -eq 'autopush.ps1') { return }
      $script:pendingChanges += $name
      if ($script:timer) { $script:timer.Stop(); $script:timer.Dispose() }
      $script:changedFiles = $script:pendingChanges | Select-Object -Unique
      $script:timer = New-Object System.Timers.Timer
      $script:timer.Interval = 5000
      $script:timer.AutoReset = $false
      Register-ObjectEvent -InputObject $script:timer -EventName Elapsed -Action {
          $script:pendingChanges = @()
          Set-Location $script:folder
          git add .
          if (git status --porcelain) {
              $msg = "Auto: $($script:changedFiles -join ', ') $(Get-Date -Format 'dd.MM HH:mm')"
              git commit -m $msg 2>&1 | Out-Null
              git push origin main 2>&1 | Out-Null
              Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Wyslano: $($script:changedFiles -join ', ')"
  -ForegroundColor Green
          }
      } | Out-Null
      $script:timer.Start()
  }

  Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
  Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
  Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null

  while ($true) { Start-Sleep -Seconds 1 }