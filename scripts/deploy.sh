#!/bin/bash

# LexStellar Deployment Script
# Usage: ./deploy.sh [network] [admin_address] [token_address]

NETWORK=${1:-testnet}
ADMIN=${2}
TOKEN=${3:-CDLZFC3SYJYDZT7K67VZ75YJBM22KZCHZ3S3YRYZ76TZVAVZ6S6KZCTO}

echo "🚀 Starting LexStellar Deployment on $NETWORK..."

# 1. Build Contracts
echo "📦 Building smart contracts..."
cargo build --target wasm32-unknown-unknown --release

# 2. Deploy Contract Manager
echo "📝 Deploying ContractManager..."
MANAGER_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/lexstellar_contract_manager.wasm \
  --source $ADMIN \
  --network $NETWORK)

echo "✅ ContractManager deployed: $MANAGER_ID"

# 3. Deploy Escrow Vault
echo "🏦 Deploying EscrowVault..."
VAULT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/lexstellar_escrow_vault.wasm \
  --source $ADMIN \
  --network $NETWORK)

echo "✅ EscrowVault deployed: $VAULT_ID"

# 4. Initialize Contracts
echo "⚙️ Initializing ContractManager..."
stellar contract invoke \
  --id $MANAGER_ID \
  --source $ADMIN \
  --network $NETWORK \
  -- \
  init \
  --admin $ADMIN \
  --escrow_vault $VAULT_ID

echo "⚙️ Initializing EscrowVault..."
stellar contract invoke \
  --id $VAULT_ID \
  --source $ADMIN \
  --network $NETWORK \
  -- \
  init \
  --admin $ADMIN \
  --contract_manager $MANAGER_ID \
  --token $TOKEN

echo "🎉 Deployment complete!"
echo "--------------------------"
echo "CONTRACT_MANAGER_ID: $MANAGER_ID"
echo "ESCROW_VAULT_ID: $VAULT_ID"
echo "--------------------------"

# Store metadata
echo "MANAGER_ID=$MANAGER_ID" > .env.deployment
echo "VAULT_ID=$VAULT_ID" >> .env.deployment
