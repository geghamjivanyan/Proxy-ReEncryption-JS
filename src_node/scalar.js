/// \brief Generic implementation for Scalar


function Scalar(bigInt /* BN */, curve /* Curve */){
    this._scalar = bigInt;
    this._curve = curve;
} 


/**
 *  get length of BN
 */
Scalar.expected_byte_length = function(curve /* Curve */){
    if (typeof curve == "undefined"){
        curve = default_curve();
    } 
    return curve.order_size();
}

/**
 * \brief Generate random BigInteger.
 * @return
 */
Scalar.generate_random = function(curve){
    if (typeof curve == "undefined"){
        curve = default_curve();
    }
    return new Scalar(curve._curve.genKeyPair().getPrivate())
}

Scalar.prototype.curve = function(){
    if (typeof this._curve == "undefined"){
        this._curve = default_curve();
    }
    return this._curve;
}
/**
 *
 */
Scalar.prototype.valueOf = function(){ return this._scalar;}

/**
 * \brief Get BigInteger from big endian ordered bytes
 * @param buffer
 * @return
 */
Scalar.from_bytes = function(buffer){
    if (buffer.length != Scalar.expected_byte_length() && buffer.length != 2 * Scalar.expected_byte_length()){
        throw new Error("Invalid length of data.");
    }
    return new Scalar(new BN(buffer)); 
}

/**
 * \brief Getting BIGNUM bytes from existing BigInteger
 * @return vector of bytes
 */
Scalar.prototype.to_bytes = function(){ 
    var bytes = this._scalar.toArray(); 
    if (bytes.length == 33){
        return bytes.slice(1,33);
    }
    return bytes;
}

Scalar.prototype.add = function(sc /* Scalar */) { return new Scalar(this.valueOf().add(sc.valueOf()));}
Scalar.prototype.sub = function(sc /* Scalar */) { return new Scalar(this.valueOf().sub(sc.valueOf()));}
Scalar.prototype.mul = function(sc /* Scalar */) { return new Scalar(this.valueOf().mul(sc.valueOf()).mod(this.curve().order()));}
Scalar.prototype.eq = function(sc /* Scalar */) { return this.valueOf().eq(sc.valueOf());}
Scalar.prototype.invm = function() { return new Scalar(this.valueOf().invm(this.curve().order()));}
