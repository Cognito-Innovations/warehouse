@"
#!/bin/bash
mkdir -p node_modules
"@ | Out-File -FilePath ".platform\hooks\prebuild\prevent-npm.sh" -Encoding UTF8