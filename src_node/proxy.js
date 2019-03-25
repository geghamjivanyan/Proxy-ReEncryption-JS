/**
 * \brief Proxy base class for handling library crypto operations and main functionality
 * Each initialized Proxy object should contain Context which will define
 * base parameters for crypto operations and configurations
 */
function Proxy(){}


Proxy.generate_key_pair = function(seed){ return KeyPair.generate_key_pair(seed); }

/**
 * \brief Making capsule out of given PublicKey and given crypto Context and also returning
 * symmetric key wrapped as a string object
 *
 * @param pk "Alice" Public Key
 * @param[out] symmetric_key_out
 * @return Capsule
 */
Proxy.encapsulate = function(publicKey){
    // generating 2 random key pairs
    var kp1 = Proxy.generate_key_pair();
    var kp2 = Proxy.generate_key_pair();

    // getting random private keys out of generated KeyPair

    var sk1 = kp1.get_private_key().valueOf();
    var sk2 = kp2.get_private_key().valueOf();

    // getting random public key points 
    var pk1 = kp1.get_public_key().valueOf();
    var pk2 = kp2.get_public_key().valueOf();
   
    // concat public  key points 
    var tmpHash = [pk1, pk2];
    var hash = hash_to_scalar(tmpHash);
    
    // Calculating part S from BN hashing -> sk1 + sk2 * hash_bn
    var part_S = sk1.add(sk2.mul(hash));    

    // Making symmetric key
    // getting main public key point
    var pk_point = publicKey.valueOf();
    
    // pk * (sk1 + sk2)
    var point_symmetric = pk_point.mul(sk1.add(sk2));
    var symmetric_key = SHA256(point_symmetric);
    
    // return capsule
    var cps = new Capsule(pk1, pk2, part_S);
    var capsule = {"capsule": cps, "symmetric_key": symmetric_key};
    return capsule
}

/**
 * \brief Decapsulate given capsule with private key,
 * NOTE: Provided private key, should be the original key from which Public Key capsule is created
 * @param capsule
 * @param privateKey
 * @return
 */
Proxy.decapsulate_original = function(capsule, privateKey){
    // get private key value
    var sk = privateKey.valueOf();
    // capsule.E + capsule.V
    var s = capsule.get_E().add(capsule.get_V());
    // get symmetric key -> s * sk = (capsule.E + capsule.V) * sk
    var point_symmetric = s.mul(sk);
    var symmetric_key = SHA256(point_symmetric); //  
    return symmetric_key;
}

/**
 * \brief Getting re-encryption key out of Private key (Alice) and public key (Bob) using random private key generation
 * @param privateKeyA
 * @param publicKeyB
 * @return
 */
Proxy.generate_re_encryption_key = function(privateKey, publicKey){
    // generate random key pair
    var kp = Proxy.generate_key_pair()
    // get random key values
    var tmp_sk = kp.get_private_key().valueOf();
    var tmp_pk = kp.get_public_key().valueOf();

    // get main public key point
    var pk_point = publicKey.valueOf();

    // concat tmp public key, main pulic key and pk * tmp_sk
    var points_for_hash = [tmp_pk, pk_point, pk_point.mul(tmp_sk)];   
     
    var hash = hash_to_scalar(points_for_hash);
    
    var sk = privateKey.valueOf();
    var hash_inv = hash.invm();
    // rk = sk * (1/hash_bn)
    var rk = sk.mul(hash_inv);
    var re_key = new ReEncryptionKey(rk, tmp_pk);
    return re_key;
}

/**
 * \brief Getting re-encryption capsule from given original capsule and re-encryption key
 * @param capsuleOriginal
 * @param reEncryptionKey
 * @return
 */
Proxy.re_encrypt_capsule = function(capsule, rk){
    // capsule.E * rk.rk
    var prime_E = capsule.get_E().mul(rk.get_re_key()); 
    // capsule.V * rk.rk
    var prime_V = capsule.get_V().mul(rk.get_re_key()); 
    var prime_S = capsule.get_S();

    return new Capsule(prime_E, prime_V, prime_S, rk.get_internal_public_key(), true);  // Is_reencrypted = true
}

/**
 * \brief Decapsulating given capsule with provided private key
 * @param re_encrypted_capsule
 * @param privateKey
 * @return
 */     
Proxy.decapsulate_re_encrypted = function(capsule, privateKey){
    var prime_XG = capsule.get_XG();
    var prime_E = capsule.get_E();
    var prime_V = capsule.get_V();

    // concat prime_XG, publicKey point, prime_XG * sk 
    var points_for_hash = [prime_XG, privateKey.get_public_key().valueOf(), prime_XG.mul(privateKey.valueOf())];

    var hash = hash_to_scalar(points_for_hash);
   
    // (capsule.E + capsule.V) * hash_bn
    var tmp_kdf_point = prime_E.add(prime_V).mul(hash); 

    var symmetric_key = SHA256(tmp_kdf_point);
    return symmetric_key;
}

Proxy.decapsulate = function(capsule, privateKey){
    if (capsule.is_re_encrypted()){
        return Proxy.decapsulate_re_encrypted(capsule, privateKey);
    }
    return Proxy.decapsulate_original(capsule, privateKey);

}

Proxy.private_key_from_bytes = function(data){ return PrivateKey.from_bytes(data); }
Proxy.public_key_from_bytes = function(data){ return PublicKey.from_bytes(data); }
Proxy.re_encryption_key_from_bytes = function(data){ return ReEncryptionKey.from_bytes(data); }
Proxy.capsule_from_bytes = function(data){ return Capsule.from_bytes(data); }
