#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _};
    use soroban_sdk::{token, Address, Env};

    #[test]
    fn test_vault_deposit_and_release() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let manager = Address::generate(&env);
        let client = Address::generate(&env);
        let recipient = Address::generate(&env);

        // 1. Register a mock Stellar Asset Contract
        let token_admin = Address::generate(&env);
        let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
        let token_client = token::Client::new(&env, &token_contract_id);
        let token_admin_client = token::StellarAssetClient::new(&env, &token_contract_id);

        // Mint some test tokens to the client
        token_admin_client.mint(&client, &10000);
        assert_eq!(token_client.balance(&client), 10000);

        // 2. Register the Escrow Vault contract
        let vault_id = env.register_contract(None, EscrowVault);
        let vault_client = EscrowVaultClient::new(&env, &vault_id);

        // Initialize the vault
        vault_client.init(&admin, &manager, &token_contract_id);

        // 3. Deposit into escrow for contract ID 42
        vault_client.deposit(&client, &42, &3000);

        // Verify balances after deposit
        assert_eq!(token_client.balance(&client), 7000);
        assert_eq!(token_client.balance(&vault_id), 3000);
        assert_eq!(vault_client.get_balance(&42), 3000);

        // 4. Release payment (invoked by manager)
        // Since mock_all_auths is enabled, manager's authorization is simulated
        vault_client.release_payment(&42, &recipient, &1200);

        // Verify balances after partial release
        assert_eq!(token_client.balance(&vault_id), 1800);
        assert_eq!(vault_client.get_balance(&42), 1800);
        assert_eq!(token_client.balance(&recipient), 1200);

        // Release the remaining amount
        vault_client.release_payment(&42, &recipient, &1800);
        assert_eq!(vault_client.get_balance(&42), 0);
        assert_eq!(token_client.balance(&recipient), 3000);
    }

    #[test]
    #[should_panic(expected = "already initialized")]
    fn test_vault_double_init() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let manager = Address::generate(&env);
        let token = Address::generate(&env);

        let vault_id = env.register_contract(None, EscrowVault);
        let vault_client = EscrowVaultClient::new(&env, &vault_id);

        vault_client.init(&admin, &manager, &token);
        vault_client.init(&admin, &manager, &token);
    }

    #[test]
    #[should_panic(expected = "insufficient funds in escrow")]
    fn test_vault_insufficient_funds() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let manager = Address::generate(&env);
        let client = Address::generate(&env);
        let recipient = Address::generate(&env);

        let token_admin = Address::generate(&env);
        let token_contract_id = env.register_stellar_asset_contract(token_admin.clone());
        let token_admin_client = token::StellarAssetClient::new(&env, &token_contract_id);
        token_admin_client.mint(&client, &1000);

        let vault_id = env.register_contract(None, EscrowVault);
        let vault_client = EscrowVaultClient::new(&env, &vault_id);
        vault_client.init(&admin, &manager, &token_contract_id);

        vault_client.deposit(&client, &1, &500);
        vault_client.release_payment(&1, &recipient, &600); // Should panic (insufficient funds)
    }
}
