#!/bin/bash
npm install -g corepack
corepack enable
corepack prepare pnpm@latest --activate

pnpm install --frozen-lockfile --shamefully-hoist