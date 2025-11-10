#!/bin/bash
echo "Prebuild: Creating empty node_modules to skip npm install" >> /var/log/eb-hooks.log
mkdir -p node_modules
echo "Prebuild done: node_modules created (empty)" >> /var/log/eb-hooks.log