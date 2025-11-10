#!/bin/bash
set -e

echo "=== Predeploy: Starting pnpm install ===" >> /var/log/eb-hooks.log
cd /var/app/staging  

echo "Setting up Corepack..." >> /var/log/eb-hooks.log
npm install -g corepack || echo "Warning: Corepack global install skipped (may be pre-installed)" >> /var/log/eb-hooks.log
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version  

echo "Running pnpm install..." >> /var/log/eb-hooks.log
pnpm install --frozen-lockfile --shamefully-hoist || { echo "pnpm install FAILED - check .npmrc/lockfile"; exit 1; }
echo "pnpm install DONE. node_modules size: $(du -sh node_modules/ 2>/dev/null || echo 'N/A')" >> /var/log/eb-hooks.log
ls -la node_modules/ | head -5 >> /var/log/eb-hooks.log 

echo "=== Predeploy done ===" >> /var/log/eb-hooks.log