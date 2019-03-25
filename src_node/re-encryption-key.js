/**
 * \brief Base definition for re-encryption key
 */
function ReEncryptionKey(re_key /* Scalar */, internal_public_key /* GroupElement */){
    this._re_key = re_key; // BigInteger
    this._internal_public_key = internal_public_key; // ECPoint
}

/**
 * \brief Getting RK number
 * @return
 */
ReEncryptionKey.prototype.get_re_key = function(){ return this._re_key; }

/**
 * Getting RK point
 * @return
 */
ReEncryptionKey.prototype.get_internal_public_key = function(){ return this._internal_public_key; }

ReEncryptionKey.from_bytes = function(buffer){
    var sc_size = Scalar.expected_byte_length();
    var ge_size = GroupElement.expected_byte_length();


    if(buffer.length != ge_size + sc_size){
        throw new Error("Invalid length of data.");
    }

    var rk = Scalar.from_bytes(buffer.slice(0, sc_size));
    var ipc = GroupElement.from_bytes(buffer.slice(sc_size, sc_size + ge_size));
    return new ReEncryptionKey(rk, ipc);
}

ReEncryptionKey.prototype.to_bytes = function(){
    var rk = this.get_re_key().to_bytes();
    var ipc = this.get_internal_public_key().to_bytes();
    return rk.concat(ipc);
} 
