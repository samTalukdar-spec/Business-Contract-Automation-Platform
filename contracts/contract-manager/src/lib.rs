#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ContractState {
    Active = 0,
    Signed = 1,
    Completed = 2,
    Disputed = 3,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub id: u32,
    pub description: String,
    pub amount: i128,
    pub is_completed: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BusinessContract {
    pub id: u32,
    pub client: Address,
    pub provider: Address,
    pub title: String,
    pub terms_hash: String,
    pub milestones: Vec<Milestone>,
    pub state: ContractState,
    pub total_amount: i128,
}

#[contracttype]
pub enum DataKey {
    Contract(u32),
    ContractCount,
    Admin,
    EscrowVault,
}

#[contract]
pub struct ContractManager;

#[contractimpl]
impl ContractManager {
    pub fn init(env: Env, admin: Address, escrow_vault: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::EscrowVault, &escrow_vault);
        env.storage().instance().set(&DataKey::ContractCount, &0u32);
    }

    pub fn create_contract(
        env: Env,
        client: Address,
        provider: Address,
        title: String,
        terms_hash: String,
        milestones: Vec<Milestone>,
    ) -> u32 {
        client.require_auth();

        let mut count: u32 = env.storage().instance().get(&DataKey::ContractCount).unwrap_or(0);
        count += 1;

        let total_amount = milestones.iter().map(|m| m.amount).sum();

        let business_contract = BusinessContract {
            id: count,
            client,
            provider: provider.clone(),
            title,
            terms_hash,
            milestones,
            state: ContractState::Active,
            total_amount,
        };

        env.storage().instance().set(&DataKey::Contract(count), &business_contract);
        env.storage().instance().set(&DataKey::ContractCount, &count);

        env.events().publish(
            (symbol_short!("contract"), symbol_short!("created")),
            count,
        );

        count
    }

    pub fn sign_contract(env: Env, contract_id: u32, signer: Address) {
        signer.require_auth();

        let mut contract: BusinessContract = env
            .storage()
            .instance()
            .get(&DataKey::Contract(contract_id))
            .expect("contract not found");

        if signer != contract.client && signer != contract.provider {
            panic!("not a party to this contract");
        }

        // Simulating a simple multi-sig: both must sign to move to Signed state
        // For brevity in this prototype, we'll mark as signed if the provider signs 
        // after creation (since client created it, we assume their intent).
        if signer == contract.provider {
            contract.state = ContractState::Signed;
            env.storage().instance().set(&DataKey::Contract(contract_id), &contract);
            
            env.events().publish(
                (symbol_short!("contract"), symbol_short!("signed")),
                contract_id,
            );
        }
    }

    pub fn complete_milestone(env: Env, contract_id: u32, milestone_id: u32) {
        let mut contract: BusinessContract = env
            .storage()
            .instance()
            .get(&DataKey::Contract(contract_id))
            .expect("contract not found");

        contract.client.require_auth();

        let mut index = 0;
        let mut found = false;
        let mut milestone_amount = 0;

        for (i, mut m) in contract.milestones.iter().enumerate() {
            if m.id == milestone_id {
                if m.is_completed {
                    panic!("milestone already completed");
                }
                m.is_completed = true;
                milestone_amount = m.amount;
                index = i;
                found = true;
                break;
            }
        }

        if !found {
            panic!("milestone not found");
        }

        // Update the milestone in the vector
        let mut updated_milestones = contract.milestones.clone();
        let mut m = updated_milestones.get(index as u32).unwrap();
        m.is_completed = true;
        updated_milestones.set(index as u32, m);
        contract.milestones = updated_milestones;

        // Check if all completed
        let all_done = contract.milestones.iter().all(|m| m.is_completed);
        if all_done {
            contract.state = ContractState::Completed;
        }

        env.storage().instance().set(&DataKey::Contract(contract_id), &contract);

        // Trigger payment from EscrowVault
        let escrow_vault: Address = env.storage().instance().get(&DataKey::EscrowVault).unwrap();
        
        // Inter-contract call to EscrowVault to release payment
        // Note: In real Soroban, we'd use a generated client or env.invoke_contract
        env.invoke_contract::<()>(
            &escrow_vault,
            &Symbol::new(&env, "release_payment"),
            soroban_sdk::vec![&env, contract_id.into(), contract.provider.into(), milestone_amount.into()],
        );

        env.events().publish(
            (symbol_short!("milestone"), symbol_short!("done")),
            (contract_id, milestone_id),
        );
    }

    pub fn get_contract(env: Env, contract_id: u32) -> BusinessContract {
        env.storage()
            .instance()
            .get(&DataKey::Contract(contract_id))
            .expect("contract not found")
    }
}

mod test;
