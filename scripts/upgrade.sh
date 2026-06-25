#!/bin/bash

# LexStellar Contract Upgrade Script
# Usage: ./upgrade.sh [network] [admin_address] [existing_manager_id]

NETWORK=${1:-testnet}
ADMIN=${2}
EXISTING_MANAGER=${3}

if [ -z "$ADMIN" ] || [ -z "$EXISTING_MANAGER" ]; then
  echo "❌ Error: Missing arguments."
  echo "Usage: ./upgrade.sh [network] [admin_address] [existing_manager_id]"
  exit 1
fi

echo "🚀 Starting LexStellar Contract Upgrade on $NETWORK..."

# 1. Build Contracts
echo "📦 Building smart contracts..."
cargo build --target wasm32-unknown-unknown --release

# 2. Install New WASM (deploys byte code to get WASM Hash)
echo "📝 Installing new ContractManager WASM..."
WASM_HASH=$(stellar contract install \
  --wasm target/wasm32-unknown-unknown/release/lexstellar_contract_manager.wasm \
  --source $ADMIN \
  --network $NETWORK)

echo "✅ New WASM Hash: $WASM_HASH"

# 3. Invoke Upgrade Function on Existing Contract Address
echo "⚙️ Upgrading ContractManager at $EXISTING_MANAGER..."
stellar contract invoke \
  --id $EXISTING_MANAGER \
  --source $ADMIN \
  --network $NETWORK \
  -- \
  upgrade \
  --new_wasm_hash $WASM_HASH

echo "🎉 Contract upgrade complete!"
echo "--------------------------"
echo "CONTRACT_ADDRESS: $EXISTING_MANAGER"
echo "NEW_WASM_HASH: $WASM_HASH"
echo "--------------------------"
