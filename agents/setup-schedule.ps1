# DevBolt - Task Scheduler Setup
# Run this script as Administrator to set up the agent orchestrator
# Usage: Right-click PowerShell > Run as Administrator > .\setup-schedule.ps1

$projectDir = "D:\development\free-solo"
$orchestrator = "$projectDir\agents\orchestrator.ps1"

Write-Host "DevBolt - Setting up agent orchestrator..."
Write-Host "Project directory: $projectDir"
Write-Host ""

# Remove old individual tasks if they exist
foreach ($name in @("FreeSolo-HealthCheck", "FreeSolo-Developer-AM", "FreeSolo-Developer-PM",
                     "FreeSolo-Strategist", "FreeSolo-Reporter", "FreeSolo-Developer",
                     "DevBolt-HealthCheck", "DevBolt-Developer", "DevBolt-Strategist", "DevBolt-Reporter")) {
    Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction SilentlyContinue
}

# Single orchestrator task - runs daily at 8 AM, dispatches agents intelligently
# MaxIterations=0 means it runs until stopped or the machine sleeps
Write-Host "Setting up DevBolt Orchestrator (daily at 8 AM, runs continuously)..."
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$orchestrator`" -MaxIterations 0 -CooldownSeconds 120 -StrategistIntervalHours 8 -ReporterIntervalHours 12 -HealthIntervalHours 4 -IdleSleepSeconds 600"
$trigger = New-ScheduledTaskTrigger -Daily -At "08:00"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 16) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName "DevBolt-Orchestrator" -Action $action -Trigger $trigger -Settings $settings -Description "DevBolt agent orchestrator - continuously dispatches health, developer, strategist, and reporter agents" -Force

Write-Host ""
Write-Host "Scheduled task created!"
Write-Host ""
Write-Host "How it works:"
Write-Host "  - Starts daily at 8 AM, runs up to 16 hours"
Write-Host "  - Developer agent runs whenever there are pending tasks"
Write-Host "  - Strategist runs every 8h to research and refill the task queue"
Write-Host "  - Reporter runs every 12h to summarize activity"
Write-Host "  - Health check runs every 4h"
Write-Host "  - When idle (no tasks, no agents overdue), sleeps 10 min then rechecks"
Write-Host ""
Write-Host "Manual commands:"
Write-Host "  Start now:           .\agents\orchestrator.ps1"
Write-Host "  Start indefinitely:  .\agents\orchestrator.ps1 -MaxIterations 0"
Write-Host "  Quick dev burst:     .\agents\run-dev-loop.ps1 -MaxIterations 5"
Write-Host "  Single agent:        .\agents\run-agent.ps1 -AgentType developer"
Write-Host ""
Write-Host "To view task:  Get-ScheduledTask -TaskName 'DevBolt-Orchestrator'"
Write-Host "To remove:     Unregister-ScheduledTask -TaskName 'DevBolt-Orchestrator'"
