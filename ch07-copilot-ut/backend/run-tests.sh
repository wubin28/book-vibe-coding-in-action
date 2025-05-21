#!/bin/bash
# 创建这个脚本，使其可执行 (chmod +x run-tests.sh)，然后运行它

# 确保使用ESM模式运行Jest
NODE_OPTIONS=--experimental-vm-modules npx jest