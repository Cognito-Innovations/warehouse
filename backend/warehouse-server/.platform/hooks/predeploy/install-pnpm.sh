@"
#!/bin/bash
# Enable Corepack (Node's built-in manager for pnpm/yarn; no global install needed on Node 16+)
npm install -g corepack  # Fallback for Amazon Linux 2023 if Corepack isn't pre-enabled
corepack enable
corepack prepare pnpm@latest --activate  # Ensures latest pnpm

# Install deps (use 'pnpm ci' if you want lockfile-only; 'pnpm install' is more forgiving)
pnpm install --frozen-lockfile
"@ | Out-File -FilePath ".platform\hooks\predeploy\install-pnpm.sh" -Encoding UTF8