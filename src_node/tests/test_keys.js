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

function test_private_key(){
//    var sc = proxy.Scalar.generate_random();

    var kp = proxy.Proxy.generate_key_pair(); // generate key pair
    var sk = kp.get_private_key(); // get private key from keypair

    var sk_b = sk.to_bytes(); // serialize private key as bytearray

    var sk_f = proxy.Proxy.private_key_from_bytes(sk_b); // get private key from bytearray

    var sk_f_b = sk_f.to_bytes(); // serialize new private key as bytearray
    assert(bytes_equal(sk_b, sk_f_b), "FAILED: Private Key from-to bytes");
}

function test_public_key_from_key_pair(){
    var kp = proxy.Proxy.generate_key_pair(); // generate key pair
    var pk = kp.get_public_key(); // get public key from keypair

    var pk_b = pk.to_bytes(); // serialize public key as bytearray

    var pk_f = proxy.Proxy.public_key_from_bytes(pk_b); // get public key from bytearray

    var pk_f_b = pk_f.to_bytes(); // serialize new public key as bytearray
    assert(bytes_equal(pk_b, pk_f_b), "FAILED: Public Key from-to bytes");
}

function test_public_key_from_private_key(){
    var kp = proxy.Proxy.generate_key_pair();

    var sk = kp.get_private_key(); // get private key from keypair
    var pk = kp.get_public_key(); // get public key fro keypair

    var pk_1 = sk.get_public_key(); // get public key from private key (sk * elliptic_curve_generator)

    assert(bytes_equal(pk.to_bytes(), pk_1.to_bytes()), "FAILED: Public key from key pair and from private key");
}

function test_re_encryption_key(){
    var kp_A = proxy.Proxy.generate_key_pair(); // generate key pair for Alice
    var kp_B = proxy.Proxy.generate_key_pair(); // generate key pair for Bob

    var sk_A = kp_A.get_private_key(); // get Alice private key from keypair

    var pk_B = kp_B.get_public_key(); // get Bob public key from keypair

    var rk_AB = proxy.Proxy.generate_re_encryption_key(sk_A, pk_B); // generate re-encryption key from Alice to Bob
    var rk_AB_b = rk_AB.to_bytes(); // serialize re-encryption key as bytearray
    var rk_AB_f = proxy.Proxy.re_encryption_key_from_bytes(rk_AB_b); // get re-encryption key from bytearray
    var rk_AB_f_b = rk_AB_f.to_bytes(); // serialize new re-encryption key as bytearray

    assert(bytes_equal(rk_AB_b, rk_AB_f_b), "FAILED: ReEncryption Key from-to bytes");
}

console.log("TEST KEYS - ", test_private_key());
