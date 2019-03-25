// AGdd test to-bytes -- from bytes:q
// Add both negative and positive tests for Encapsulate <> Decapsulate (Original). 
// Add both negative and positive tests for encapsulate <> decapsulate where private / public keys are recovered from byte arrays. Use prefixed// keys

function test_encapsulation_decapsulation(){
    var alice_key_pair = Proxy.generateKeyPair();
    console.log("ALICE KEY PAIR - ", alice_key_pair);

    var alice_private_key = alice_key_pair.get_private_key();
    console.log("ALICE PRIVATE KEY - ", alice_private_key);

    var alice_private_key_to_bytes = alice_private_key.to_bytes();
    console.log("ALICE PRIVATE KEY TO BYTES - ", alice_private_key_to_bytes)

    var alice_public_key = alice_key_pair.get_public_key();
    console.log("ALICE PUBLIC KEY - ", alice_public_key);

    var alice_public_key_to_bytes = alice_public_key.to_bytes()
    console.log("ALICE PUBLIC KEY TO BYTES - ", alice_public_key_to_bytes);

    var alice_capsule = Proxy.encapsulate(alice_public_key);
    var alice_capsule_1 = alice_capsule.capsule;
    console.log("ALICE CAPSULE - ", alice_capsule_1);

    var alice_symmetric_key_1 = alice_capsule.symmetric_key;
    console.log("ALICE SYMMETRIC KEY - ", alice_symmetric_key_1);

    var alice_symmetric_key_2 = Proxy.decapsulate_original(alice_capsule_1, alice_private_key);

    if (alice_symmetric_key_1 != alice_symmetric_key_2 ){
        throw new Error('Symmetric Key is not the same for Alice');
    }else{
        console.log("ALICE AND BOB SYMMETRIC KEYS ARE EQUAL!");
    }

    var bob_key_pair = Proxy.generateKeyPair();
    console.log("BOB KEY PAIR - ", bob_key_pair);

    var bob_private_key = bob_key_pair.get_private_key(); 
    var bob_public_key = bob_key_pair.get_public_key();

    var rekey_AB = Proxy.generate_re_encryption_key(alice_private_key, bob_public_key);
    console.log("REKEY_AB - ", rekey_AB);

    var rekey_AB_to_bytes = rekey_AB.to_bytes();
    console.log("REKEY_AB TO BYTES - " , rekey_AB_to_bytes);

    var re_encrypted_capsule = Proxy.re_encrypt_capsule(alice_capsule_1, rekey_AB);
    console.log("RE- ENCRYPTED CAPSULE - ", re_encrypted_capsule);

    var bob_symmetric_key = Proxy.decapsulate_re_encrypted(re_encrypted_capsule, bob_private_key)
    console.log("BOB SYMMETRIC KEY - ", bob_symmetric_key);

    if (alice_symmetric_key_1 != bob_symmetric_key){
        throw new Error('Symmetric Key is not the same for Alice and Bob');
    }else{
        console.log("ALICE AND BOB SYMMETRIC KEYS ARE EQUAL!");
    }
    return 0;
}

function call_test(){
//    test_BN();
    test_encapsulation_decapsulation();
}
