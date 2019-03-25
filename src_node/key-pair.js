/**
 * \brief Key Pair for public and Private Keys
 * This class used as a combination of Public and Private keys, and can do some actions with both of them
 */
function KeyPair(prvKey/* PrivateKey */, pubKey/* PublicKey */){
    this._private_key = prvKey;  // PrivateKey
    this._public_key = pubKey;   // PublicKey
}

/**
 * \brief Generating random KeyPair with their private and public keys
 * This is using Private key generator and getting public key out of generated private key
 * @return
 */
KeyPair.generate_key_pair = function(seed){
    
    var prvKey = PrivateKey.generate(seed);
    return new KeyPair(prvKey, prvKey.get_public_key());
}

/**
 * \brief Getting public key
 * @return
 */
KeyPair.prototype.get_public_key = function(){
    return this._public_key;
}

/**
 * Getting private key
 * @return
 */
KeyPair.prototype.get_private_key = function(){
    return this._private_key;
}
