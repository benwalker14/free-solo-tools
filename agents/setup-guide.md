# FreeSolo Tools - Setup Guide

## Step 1: Create GitHub Repository
```bash
cd D:\development\free-solo
gh repo create free-solo-tools --public --source=. --remote=origin --push
```

## Step 2: Deploy to Vercel
Option A (CLI):
```bash
npm install -g vercel
vercel --prod
```

Option B (Web):
1. Go to vercel.com and sign in with GitHub
2. Import the free-solo-tools repository
3. Keep all defaults and click Deploy

## Step 3: Set Up Scheduled Agents
1. Open PowerShell as Administrator
2. Run: `D:\development\free-solo\agents\setup-schedule.ps1`
3. Verify: `Get-ScheduledTask | Where-Object {$_.TaskName -like 'FreeSolo*'}`

## Step 4: (Optional) Custom Domain
1. Buy a domain (e.g., freesolotools.com from Namecheap ~$12/year)
2. Add it in Vercel dashboard > Project Settings > Domains
3. Update DNS as instructed by Vercel

## Step 5: (Later) Stripe Setup
When ready to accept payments:
1. Create a Stripe account at stripe.com
2. Get your publishable key and secret key
3. Add them as environment variables in Vercel
4. The developer agent will handle the Stripe integration code
