#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, token};

#[contracttype]
pub enum DataKey {
    Admin,
    ContractManager,
    Balance(u32), // contract_id -> balance
    Token,
}

#[contract]
pub struct EscrowVault;

#[contractimpl]
impl EscrowVault {
    pub fn init(env: Env, admin: Address, contract_manager: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ContractManager, &contract_manager);
        env.storage().instance().set(&DataKey::Token, &token);
    }

    pub fn deposit(env: Env, from: Address, contract_id: u32, amount: i128) {
        from.require_auth();

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        
        client.transfer(&from, &env.current_contract_address(), &amount);

        let key = DataKey::Balance(contract_id);
        let current_balance: i128 = env.storage().instance().get(&key).unwrap_or(0);
        env.storage().instance().set(&key, &(current_balance + amount));

        env.events().publish(
            (symbol_short!("deposit"), contract_id),
            amount,
        );
    }

    pub fn release_payment(env: Env, contract_id: u32, recipient: Address, amount: i128) {
        let manager: Address = env.storage().instance().get(&DataKey::ContractManager).expect("not initialized");
        manager.require_auth();

        let key = DataKey::Balance(contract_id);
        let current_balance: i128 = env.storage().instance().get(&key).unwrap_or(0);
        
        if current_balance < amount {
            panic!("insufficient funds in escrow");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token_addr);
        
        client.transfer(&env.current_contract_address(), &recipient, &amount);

        env.storage().instance().set(&key, &(current_balance - amount));

        env.events().publish(
            (symbol_short!("release"), contract_id),
            (recipient, amount),
        );
    }

    pub fn get_balance(env: Env, contract_id: u32) -> i128 {
        env.storage().instance().get(&DataKey::Balance(contract_id)).unwrap_or(0)
    }
}

mod test;
