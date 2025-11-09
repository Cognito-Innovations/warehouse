#!/bin/bash
set -e

# Install nvm and Node.js 23
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] || curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node.js 23
nvm install 23
nvm use 23
nvm alias default 23

# Add nvm to bashrc so it's available in all shells
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo 'nvm use 23' >> ~/.bashrc

# Install pnpm
npm install -g pnpm

# Note: node_modules is already included in the zip, so we don't need to install dependencies
