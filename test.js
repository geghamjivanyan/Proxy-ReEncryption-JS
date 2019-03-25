var sc = require('./proxy-minified.js');


function test_capsule(){
    var kp_A = sc.Proxy.generateKeyPair();
    console.log("KP_A - ", kp_A);

    capsule_A = sc.Proxy.encapsulate(kp_A.get_public_key());
    console.log("Capsule - ", capsule_A);

    var sym_key_A = capsule_A.symmetric_key;

    var kp_B = sc.Proxy.generateKeyPair();
    console.log("KP_B - ", kp_B);

    var rk_AB = sc.Proxy.get_re_encryption_key(kp_A.get_private_key(), kp_B.get_public_key());
    console.log("RK_AB - ", rk_AB);

    var re_capsule = sc.Proxy.get_re_encryption_capsule(capsule_A.capsule, rk_AB);
    console.log("ReCapsule - ", re_capsule);

    var sym_key_B = sc.Proxy.decapsulate_re_encrypted(re_capsule, kp_B.get_private_key())
    console.log("Decapsule - ", sym_key_B);

    if (sym_key_A != sym_key_B){
        throw new Error('Symmetric Key is not the same for Alice and Bob');
    }else{
        console.log("SYM KEYS ARE EQUAL!");
    }

}
function call_test(){
    test_capsule();
}
//console.log("TEST - ", test_capsule());
