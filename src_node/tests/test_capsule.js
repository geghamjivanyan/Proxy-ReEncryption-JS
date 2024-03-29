var proxy = require('../proxy-minified.js');
var assert = require('assert');

function bytes_equal(data1, data2){
    if (data1.length != data2.length){
        return false;
    }
    for(var i = 0; i < data1.length; i++){
        if (data1[i] != data2[i]){
            return false;
        }
    }
    return true;
}

function test_capsule(){
    var kp = proxy.Proxy.generate_key_pair();
    var pk = kp.get_public_key();

    var cp = proxy.Proxy.encapsulate(pk); // encapsulate with public key
    var capsule = cp.capsule; // get capsule from {capsule, symmetric-key} pair 
    var capsule_b = capsule.to_bytes();

    var capsule_f = proxy.Proxy.capsule_from_bytes(capsule_b);
    var capsule_f_b = capsule_f.to_bytes();

    assert(bytes_equal(capsule_b, capsule_f_b), "Capsule from-to bytes");
}


function test_decapsulate_original_capsule_with_right_key(){
    var kp = proxy.Proxy.generate_key_pair();

    var sk = kp.get_private_key();
    var pk = kp.get_public_key();

    var cp = proxy.Proxy.encapsulate(pk);
    var original_sym_key = cp.symmetric_key;
    var capsule = cp.capsule;

    var decapsulated_sym_key = proxy.Proxy.decapsulate(capsule, sk);

    assert(original_sym_key.eq(decapsulated_sym_key), "Decapsulate Original Capsule with Right key");
}

function test_decapsulate_original_capsule_with_wrong_key(){
    var kp = proxy.Proxy.generate_key_pair();
    var kp_1 = proxy.Proxy.generate_key_pair();

    var pk = kp.get_public_key();

    var sk_1 = kp_1.get_private_key();

    var cp = proxy.Proxy.encapsulate(pk);
    var original_sym_key = cp.symmetric_key;
    var capsule = cp.capsule;

    var decapsulated_sym_key = proxy.Proxy.decapsulate(capsule, sk_1);

    assert(!original_sym_key.eq(decapsulated_sym_key), "Decapsulate Original Capsule with Wrong key");
}


function test_re_encrypted_capsule(){
    var kp_A = proxy.Proxy.generate_key_pair();
    var kp_B = proxy.Proxy.generate_key_pair();

    var sk_A = kp_A.get_private_key();
    var pk_A = kp_A.get_public_key();
    
    var pk_B = kp_B.get_public_key();

    var cp = proxy.Proxy.encapsulate(pk_A);
    var capsule = cp.capsule;

    var rk_AB = proxy.Proxy.generate_re_encryption_key(sk_A, pk_B);
    var re_capsule = proxy.Proxy.re_encrypt_capsule(capsule, rk_AB);
    
    var capsule_b = re_capsule.to_bytes();

    var capsule_f = proxy.Proxy.capsule_from_bytes(capsule_b);

    var capsule_f_b = capsule_f.to_bytes();

    assert(bytes_equal(capsule_b, capsule_f_b), "Re Encrypted Capsule");
}

function test_decapsulate_re_encrypted_capsule_with_right_key(seed){
    var kp_A = proxy.Proxy.generate_key_pair(seed);
    var kp_B = proxy.Proxy.generate_key_pair(seed);

    var sk_A = kp_A.get_private_key();
    var pk_A = kp_A.get_public_key();

    var sk_B = kp_B.get_private_key();
    var pk_B = kp_B.get_public_key();
    
    var cp = proxy.Proxy.encapsulate(pk_A);
    var capsule = cp.capsule;
    var original_sym_key = cp.symmetric_key;

    var rk_AB = proxy.Proxy.generate_re_encryption_key(sk_A, pk_B);
    var re_capsule = proxy.Proxy.re_encrypt_capsule(capsule, rk_AB);

    var decapsulated_sym_key = proxy.Proxy.decapsulate(re_capsule, sk_B);
   
    assert(original_sym_key.eq(decapsulated_sym_key), "Decapsulate Re Encrypted Capsule with Right key");
}

function test_decapsulate_re_encrypted_capsule_with_alice_key(){
    var kp_A = proxy.Proxy.generate_key_pair();
    var kp_B = proxy.Proxy.generate_key_pair();

    var sk_A = kp_A.get_private_key();
    var pk_A = kp_A.get_public_key();

    var sk_B = kp_B.get_private_key();
    var pk_B = kp_B.get_public_key();
    
    var cp = proxy.Proxy.encapsulate(pk_A);
    var capsule = cp.capsule;
    var original_sym_key = cp.symmetric_key;

    var rk_AB = proxy.Proxy.generate_re_encryption_key(sk_A, pk_B);
    var re_capsule = proxy.Proxy.re_encrypt_capsule(capsule, rk_AB);

    var decapsulated_sym_key = proxy.Proxy.decapsulate(re_capsule, sk_A);
   
    assert(!original_sym_key.eq(decapsulated_sym_key), "Decapsulate Re Encrypted Capsule with Wrong Key");
}

console.log("CAPSULE TEST - " , test_decapsulate_re_encrypted_capsule_with_right_key());
