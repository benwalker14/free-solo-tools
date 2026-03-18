# DevBolt - Continuous Developer Loop
# Runs the developer agent repeatedly until the task board is clear or max iterations hit.
# Usage: .\run-dev-loop.ps1 [-MaxIterations 10] [-CooldownSeconds 120]

param(
    [int]$MaxIterations = 10,
    [int]$CooldownSeconds = 120
)

$projectDir = "D:\development\free-solo"
$taskBoard = "$projectDir\TASK_BOARD.md"
$agentScript = "$projectDir\agents\run-agent.ps1"

function Get-PendingTaskCount {
    if (-not (Test-Path $taskBoard)) { return 0 }
    $content = Get-Content $taskBoard -Raw
    $matches = [regex]::Matches($content, '- \[ \]')
    return $matches.Count
}

Set-Location $projectDir

$iteration = 0
$totalTasks = Get-PendingTaskCount
Write-Host "=== DevBolt Developer Loop ==="
Write-Host "Pending tasks: $totalTasks"
Write-Host "Max iterations: $MaxIterations"
Write-Host "Cooldown between runs: ${CooldownSeconds}s"
Write-Host ""

while ($iteration -lt $MaxIterations) {
    $pendingTasks = Get-PendingTaskCount

    if ($pendingTasks -eq 0) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] No pending tasks. Backlog clear!"
        break
    }

    $iteration++
    Write-Host "============================================"
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Iteration $iteration/$MaxIterations ($pendingTasks tasks remaining)"
    Write-Host "============================================"

    # Run the developer agent
    & $agentScript -AgentType developer

    if ($iteration -lt $MaxIterations) {
        $remainingTasks = Get-PendingTaskCount
        if ($remainingTasks -gt 0) {
            Write-Host ""
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Cooling down for ${CooldownSeconds}s before next iteration..."
            Start-Sleep -Seconds $CooldownSeconds
        }
    }
}

if ($iteration -ge $MaxIterations) {
    Write-Host ""
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Hit max iterations ($MaxIterations). Stopping."
    Write-Host "Remaining tasks: $(Get-PendingTaskCount)"
}

Write-Host ""
Write-Host "=== Developer loop finished. $iteration iterations completed. ==="
