# DevBolt - Task Scheduler Setup
# Run this script as Administrator to set up the agent orchestrator
# Usage: Right-click PowerShell > Run as Administrator > .\setup-schedule.ps1

$projectDir = "D:\development\free-solo"
$orchestrator = "$projectDir\agents\orchestrator.ps1"

Write-Host "DevBolt - Setting up agent orchestrator..."
Write-Host "Project directory: $projectDir"
Write-Host ""

# Remove old tasks
foreach ($name in @("FreeSolo-HealthCheck", "FreeSolo-Developer-AM", "FreeSolo-Developer-PM",
                     "FreeSolo-Strategist", "FreeSolo-Reporter", "FreeSolo-Developer",
                     "DevBolt-HealthCheck", "DevBolt-Developer", "DevBolt-Strategist",
                     "DevBolt-Reporter", "DevBolt-Orchestrator")) {
    Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction SilentlyContinue
}

# Orchestrator runs indefinitely, restarts daily at midnight as a safety net
Write-Host "Setting up DevBolt Orchestrator (always on, restarts at midnight)..."
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$orchestrator`" -MaxIterations 0 -CooldownSeconds 120 -StrategistIntervalHours 8 -ReporterIntervalHours 12 -HealthIntervalHours 4 -IdleSleepSeconds 600"

# Trigger 1: At system startup (so it survives reboots)
$triggerStartup = New-ScheduledTaskTrigger -AtStartup
# Trigger 2: Daily at midnight (safety net restart if it dies)
$triggerDaily = New-ScheduledTaskTrigger -Daily -At "00:00"

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Duration 0) `
    -MultipleInstances IgnoreNew `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 5)

Register-ScheduledTask -TaskName "DevBolt-Orchestrator" `
    -Action $action `
    -Trigger @($triggerStartup, $triggerDaily) `
    -Settings $settings `
    -Description "DevBolt agent orchestrator - runs 24/7, dispatches agents as needed" `
    -Force

Write-Host ""
Write-Host "Scheduled task created!"
Write-Host ""
Write-Host "How it works:"
Write-Host "  - Runs 24/7 (starts at boot, restarts at midnight as safety net)"
Write-Host "  - Developer agent runs whenever there are pending tasks"
Write-Host "  - Strategist runs every 8h to research and refill the task queue"
Write-Host "  - Reporter runs every 12h to summarize activity"
Write-Host "  - Health check runs every 4h"
Write-Host "  - When idle, sleeps 10 min then rechecks"
Write-Host "  - Restarts automatically up to 3x on failure (5 min intervals)"
Write-Host ""
Write-Host "Manual commands:"
Write-Host "  Start now:           .\agents\orchestrator.ps1 -MaxIterations 0"
Write-Host "  Quick dev burst:     .\agents\run-dev-loop.ps1 -MaxIterations 5"
Write-Host "  Single agent:        .\agents\run-agent.ps1 -AgentType developer"
Write-Host ""
Write-Host "To view task:  Get-ScheduledTask -TaskName 'DevBolt-Orchestrator'"
Write-Host "To stop:       Stop-ScheduledTask -TaskName 'DevBolt-Orchestrator'"
Write-Host "To remove:     Unregister-ScheduledTask -TaskName 'DevBolt-Orchestrator'"
