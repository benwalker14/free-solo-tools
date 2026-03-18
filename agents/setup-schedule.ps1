# FreeSolo Tools - Task Scheduler Setup
# Run this script as Administrator to set up automated agents
# Usage: Right-click PowerShell > Run as Administrator > .\setup-schedule.ps1

$projectDir = "D:\development\free-solo"
$agentScript = "$projectDir\agents\run-agent.ps1"
$devLoopScript = "$projectDir\agents\run-dev-loop.ps1"

Write-Host "FreeSolo Tools - Setting up scheduled agents..."
Write-Host "Project directory: $projectDir"
Write-Host ""

# Remove old developer tasks if they exist
Unregister-ScheduledTask -TaskName "FreeSolo-Developer-AM" -Confirm:$false -ErrorAction SilentlyContinue
Unregister-ScheduledTask -TaskName "FreeSolo-Developer-PM" -Confirm:$false -ErrorAction SilentlyContinue

# Health Check Agent - every 4 hours
Write-Host "Setting up Health Check agent (every 4 hours)..."
$healthAction = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$agentScript`" -AgentType health"
$healthTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date -RepetitionInterval (New-TimeSpan -Hours 4)
$healthSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 30)
Register-ScheduledTask -TaskName "FreeSolo-HealthCheck" -Action $healthAction -Trigger $healthTrigger -Settings $healthSettings -Description "FreeSolo Tools health check agent" -Force

# Developer Loop - daily at 8 AM, runs continuously until backlog is clear (max 10 iterations)
Write-Host "Setting up Developer loop (daily at 8 AM, continuous until backlog clear)..."
$devAction = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$devLoopScript`" -MaxIterations 10 -CooldownSeconds 120"
$devTrigger = New-ScheduledTaskTrigger -Daily -At "08:00"
$devSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 8)
Register-ScheduledTask -TaskName "FreeSolo-Developer" -Action $devAction -Trigger $devTrigger -Settings $devSettings -Description "FreeSolo Tools developer loop - burns through backlog" -Force

# Strategist Agent - daily at 10 AM
Write-Host "Setting up Strategist agent (daily at 10 AM)..."
$stratAction = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$agentScript`" -AgentType strategist"
$stratTrigger = New-ScheduledTaskTrigger -Daily -At "10:00"
$stratSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 45)
Register-ScheduledTask -TaskName "FreeSolo-Strategist" -Action $stratAction -Trigger $stratTrigger -Settings $stratSettings -Description "FreeSolo Tools strategist agent" -Force

# Reporter Agent - daily at 6 PM
Write-Host "Setting up Reporter agent (daily at 6 PM)..."
$reportAction = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$agentScript`" -AgentType reporter"
$reportTrigger = New-ScheduledTaskTrigger -Daily -At "18:00"
$reportSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 30)
Register-ScheduledTask -TaskName "FreeSolo-Reporter" -Action $reportAction -Trigger $reportTrigger -Settings $reportSettings -Description "FreeSolo Tools reporter agent" -Force

Write-Host ""
Write-Host "All scheduled tasks created successfully!"
Write-Host ""
Write-Host "Schedule summary:"
Write-Host "  Health Check:  Every 4 hours"
Write-Host "  Developer:     Daily at 8:00 AM (loops until backlog clear, max 10 tasks)"
Write-Host "  Strategist:    Daily at 10:00 AM"
Write-Host "  Reporter:      Daily at 6:00 PM"
Write-Host ""
Write-Host "Manual commands:"
Write-Host "  Start dev loop now:  .\agents\run-dev-loop.ps1"
Write-Host "  Run single agent:    .\agents\run-agent.ps1 -AgentType developer"
Write-Host ""
Write-Host "To view tasks: Get-ScheduledTask | Where-Object {`$_.TaskName -like 'FreeSolo*'}"
Write-Host "To remove all: Get-ScheduledTask | Where-Object {`$_.TaskName -like 'FreeSolo*'} | Unregister-ScheduledTask"
