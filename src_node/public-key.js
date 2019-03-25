/**
 * \brief PublicKey class is a base implementation for keeping EC Public Key as an object
 */
function PublicKey(pubKey /* GroupElement */){
    this.pubKey = pubKey; // pubKeyObj
} 


/**
 * Getting point from this public key
 * @return
 */
PublicKey.prototype.valueOf = function(){
    return this.pubKey
}

PublicKey.from_bytes = function(buffer){ 
    return new PublicKey(GroupElement.from_bytes(buffer));
}

PublicKey.prototype.to_bytes = function(){
     return this.valueOf().to_bytes();
}
