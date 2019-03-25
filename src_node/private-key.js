/**
 * \brief Base private key containing implementation for EC Private keys
 * \brief Main constructor for making PrivateKey object
 */
function PrivateKey(prvKey /* Scalar */, pubKey /* PublicKey */){
    this._scalar = prvKey;  // prvKeyObj
    if (typeof pubKey == "undefined"){
        curve = new Curve();
        pubKey = new PublicKey(new GroupElement(curve.generator().mul(prvKey.valueOf())));
    }
    this._public_key = pubKey;
} 

/**
 * \brief Generating PrivateKey
 * @param 
 * @return PrivateKey
 */

PrivateKey.genPrivKey = function(seed, curve, options){
  // Instantiate Hmac_DRBG
  var drbg = new HmacDRBG({
    hash: curve._curve.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || elliptic.rand(curve._curve.hash.hmacStrength),
    entropyEnc: options.entropy && options.entropyEnc || 'utf8',
    nonce: curve._curve.n.toArray()
  });

  var bytes = curve._curve.n.byteLength();
  var ns2 = curve._curve.n.sub(new BN(2));
  do {
    var priv = new BN(drbg.generate(bytes, seed));
    if (priv.cmp(ns2) > 0)
      continue;

    priv.iaddn(1);
    console.log("PRIV - ", priv);
    return  curve._curve.keyFromPrivate(priv);
  } while (true);

}

PrivateKey.generate = function(seed, curve, options){
    if (typeof curve == "undefined"){
        curve = default_curve();
    }
    if (typeof seed !== "undefined"){
        seed = seed.toString('hex');
    }
    if (!options)
    options = {};

    var priv = PrivateKey.genPrivKey(seed, curve, options);

    var kp = curve._curve.genKeyPair(seed);
    return new PrivateKey(new Scalar(kp.getPrivate()), new PublicKey(new GroupElement(kp.getPublic())));
}

/**
 * \brief Getting the big integer which is representing this Private Key.
 */
PrivateKey.prototype.valueOf = function(){ return this._scalar; }

/**
 * \brief Getting generated PublicKey
 * @return PublicKey
 */
PrivateKey.prototype.get_public_key = function(){ 
    curve = new Curve();
    return new PublicKey(new GroupElement(curve.generator().mul(this.valueOf().valueOf())));
}

/**
 * \brief Get BigInteger from big endian ordered bytes
 * @param buffer
 * @return
 */
PrivateKey.from_bytes = function(buffer){ 
    return new PrivateKey(Scalar.from_bytes(buffer)); 
}

/**
 * \brief Getting BIGNUM bytes from existing BigInteger
 * @return vector of bytes
 */
PrivateKey.prototype.to_bytes = function(){ 
    return this.valueOf().to_bytes(); 
}
