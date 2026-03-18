# DevBolt - Agent Orchestrator
# Continuously dispatches the right agent based on what needs doing.
# Replaces separate scheduled tasks with intelligent dispatch.
#
# Usage: .\orchestrator.ps1 [-MaxIterations 50] [-CooldownSeconds 120]
# For indefinite run: .\orchestrator.ps1 -MaxIterations 0

param(
    [int]$MaxIterations = 50,
    [int]$CooldownSeconds = 120,
    [int]$StrategistIntervalHours = 8,
    [int]$ReporterIntervalHours = 12,
    [int]$HealthIntervalHours = 4,
    [int]$IdleSleepSeconds = 600
)

$projectDir = "D:\development\free-solo"
$agentScript = "$projectDir\agents\run-agent.ps1"
$timestampDir = "$projectDir\agents\logs"
$taskBoard = "$projectDir\TASK_BOARD.md"

function Get-LastRunTime($agentType) {
    $file = "$timestampDir\last-$agentType.txt"
    if (Test-Path $file) {
        return [DateTime](Get-Content $file -Raw).Trim()
    }
    return [DateTime]::MinValue
}

function Set-LastRunTime($agentType) {
    $dir = Split-Path "$timestampDir\last-$agentType.txt"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    (Get-Date).ToString("o") | Set-Content "$timestampDir\last-$agentType.txt"
}

function Get-PendingTaskCount {
    if (-not (Test-Path $taskBoard)) { return 0 }
    $content = Get-Content $taskBoard -Raw
    $matches = [regex]::Matches($content, '- \[ \]')
    return $matches.Count
}

function Select-Agent {
    $now = Get-Date
    $pendingTasks = Get-PendingTaskCount
    $hoursSinceHealth = ($now - (Get-LastRunTime "health")).TotalHours
    $hoursSinceStrategist = ($now - (Get-LastRunTime "strategist")).TotalHours
    $hoursSinceReporter = ($now - (Get-LastRunTime "reporter")).TotalHours

    # Priority 1: Health check if overdue
    if ($hoursSinceHealth -ge $HealthIntervalHours) {
        return @{ type = "health"; reason = "Health check overdue ($('{0:N1}' -f $hoursSinceHealth)h since last)" }
    }

    # Priority 2: Developer if there are tasks to do
    if ($pendingTasks -gt 0) {
        return @{ type = "developer"; reason = "$pendingTasks pending tasks on board" }
    }

    # Priority 3: Strategist to generate more tasks (when queue is empty or interval elapsed)
    if ($hoursSinceStrategist -ge $StrategistIntervalHours) {
        return @{ type = "strategist"; reason = "No pending tasks + strategist overdue ($('{0:N1}' -f $hoursSinceStrategist)h since last)" }
    }

    # Priority 4: Reporter if enough time has passed
    if ($hoursSinceReporter -ge $ReporterIntervalHours) {
        return @{ type = "reporter"; reason = "Reporter overdue ($('{0:N1}' -f $hoursSinceReporter)h since last)" }
    }

    return $null
}

Set-Location $projectDir

Write-Host "=== DevBolt Agent Orchestrator ==="
Write-Host "Max iterations: $(if ($MaxIterations -eq 0) { 'unlimited' } else { $MaxIterations })"
Write-Host "Cooldown: ${CooldownSeconds}s | Idle sleep: ${IdleSleepSeconds}s"
Write-Host "Intervals: health=${HealthIntervalHours}h, strategist=${StrategistIntervalHours}h, reporter=${ReporterIntervalHours}h"
Write-Host ""

$iteration = 0
while ($MaxIterations -eq 0 -or $iteration -lt $MaxIterations) {
    $selected = Select-Agent

    if ($null -eq $selected) {
        $nextHealth = [math]::Max(0, $HealthIntervalHours - (Get-Date - (Get-LastRunTime "health")).TotalHours)
        $nextStrat = [math]::Max(0, $StrategistIntervalHours - (Get-Date - (Get-LastRunTime "strategist")).TotalHours)
        $nextReport = [math]::Max(0, $ReporterIntervalHours - (Get-Date - (Get-LastRunTime "reporter")).TotalHours)
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Nothing to do. Next: health in $('{0:N1}' -f $nextHealth)h, strategist in $('{0:N1}' -f $nextStrat)h, reporter in $('{0:N1}' -f $nextReport)h"
        Write-Host "  Sleeping ${IdleSleepSeconds}s..."
        Start-Sleep -Seconds $IdleSleepSeconds
        continue
    }

    $iteration++
    $label = if ($MaxIterations -eq 0) { "#$iteration" } else { "$iteration/$MaxIterations" }
    Write-Host "============================================"
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Iteration $label | Agent: $($selected.type)"
    Write-Host "  Reason: $($selected.reason)"
    Write-Host "============================================"

    & $agentScript -AgentType $selected.type
    Set-LastRunTime $selected.type

    Write-Host ""
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $($selected.type) agent finished. Cooling down ${CooldownSeconds}s..."
    Start-Sleep -Seconds $CooldownSeconds
}

Write-Host ""
Write-Host "=== Orchestrator finished after $iteration iterations. ==="
