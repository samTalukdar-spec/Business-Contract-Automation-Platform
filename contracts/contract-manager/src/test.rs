#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Events};
    use soroban_sdk::{contract, contractimpl, vec, Env, IntoVal, Address, String};

    #[contract]
    pub struct MockEscrowVault;

    #[contractimpl]
    impl MockEscrowVault {
        pub fn release_payment(_env: Env, contract_id: u32, _recipient: Address, amount: i128) {
            // Assert parameters are correct when called from ContractManager
            assert_eq!(contract_id, 1);
            assert_eq!(amount, 1000);
        }
    }

    #[test]
    fn test_create_and_sign_contract() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let escrow = Address::generate(&env);
        let client = Address::generate(&env);
        let provider = Address::generate(&env);

        let contract_id = env.register_contract(None, ContractManager);
        let client_managed = ContractManagerClient::new(&env, &contract_id);

        client_managed.init(&admin, &escrow);

        let title = String::from_str(&env, "Test Dev");
        let hash = String::from_str(&env, "QmHash");
        let milestones = vec![&env, Milestone {
            id: 1,
            description: String::from_str(&env, "Kickoff"),
            amount: 1000,
            is_completed: false,
        }];

        let id = client_managed.create_contract(&client, &provider, &title, &hash, &milestones);
        assert_eq!(id, 1);

        // Sign contract
        client_managed.sign_contract(&1, &provider);
        let c = client_managed.get_contract(&1);
        assert_eq!(c.state, ContractState::Signed);
    }

    #[test]
    #[should_panic(expected = "not a party to this contract")]
    fn test_unauthorized_sign() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let escrow = Address::generate(&env);
        let client = Address::generate(&env);
        let provider = Address::generate(&env);
        let intruder = Address::generate(&env);

        let contract_id = env.register_contract(None, ContractManager);
        let client_managed = ContractManagerClient::new(&env, &contract_id);

        client_managed.init(&admin, &escrow);

        let milestones = vec![&env];
        client_managed.create_contract(&client, &provider, &String::from_str(&env, "T"), &String::from_str(&env, "H"), &milestones);

        client_managed.sign_contract(&1, &intruder);
    }

    #[test]
    fn test_milestone_completion_and_payment_trigger() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let escrow_id = env.register_contract(None, MockEscrowVault);
        let client = Address::generate(&env);
        let provider = Address::generate(&env);

        let contract_id = env.register_contract(None, ContractManager);
        let client_managed = ContractManagerClient::new(&env, &contract_id);

        client_managed.init(&admin, &escrow_id);

        let title = String::from_str(&env, "Smart Contract Audit");
        let hash = String::from_str(&env, "QmHashAud");
        let milestones = vec![&env, Milestone {
            id: 1,
            description: String::from_str(&env, "Vulnerability Report"),
            amount: 1000,
            is_completed: false,
        }];

        let id = client_managed.create_contract(&client, &provider, &title, &hash, &milestones);
        assert_eq!(id, 1);

        // Sign contract
        client_managed.sign_contract(&1, &provider);

        // Complete milestone (triggers inter-contract call)
        client_managed.complete_milestone(&1, &1);

        // Verify milestone is updated to completed
        let c = client_managed.get_contract(&1);
        assert!(c.milestones.get(0).unwrap().is_completed);
        assert_eq!(c.state, ContractState::Completed);
    }
}
