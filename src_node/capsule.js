/**
 * \brief Combination of parameters as a definition for cryptographic capsule
 * Each capsule contains E(POINT_TYPE), V(POINT_TYPE), s(NUMBER_TYPE)
 * \brief Making capsule with given particles
 * @param E
 * @param V
 * @param S
 * @param XG
 * @param re_encrypted
 */
function Capsule(E, V, S, XG, is_re_encrypted){
    if (typeof is_re_encrypted == "undefined"){
        is_re_encrypted = false;
    }
    this._E = E;  // ECPoint
    this._V = V;  // ECPoint
    this._S = S;  // BN
    this._XG = XG;// ECPoint 
    this._re_encrypted = is_re_encrypted; //bool
}

/**
 * Getting particle E as a POINT_TYPE
 * @return
 */
Capsule.prototype.get_E = function(){ return this._E; }

/**
 * Getting particle V as a POINT_TYPE
 * @return
 */
Capsule.prototype.get_V = function(){ return this._V; }

/**
 * Getting particle S as a NUMBER_TYPE
 * @return
 */
Capsule.prototype.get_S = function(){ return this._S; }

/**
 * Getting particle XG
 * @return
 */
Capsule.prototype.get_XG = function(){ return this._XG; }

/**
 * \brief Setting capsule as re-encryption capsule
 */
Capsule.prototype.set_re_encrypted = function(){ this._re_encrypted = true; }

/**
 * \brief Checking if we have re-encryption capsule or not
 * @return
 */
Capsule.prototype.is_re_encrypted = function(){ return this._re_encrypted; }

Capsule.from_bytes = function(buffer){
    var sc_size = Scalar.expected_byte_length();
    var ge_size = GroupElement.expected_byte_length();

    var re_encrypted = false;

    if(buffer.length == 3*ge_size + sc_size){
        re_encrypted = true;
    }
    else if (buffer.length != 2*ge_size + sc_size){
        throw new Error("Invalid length of data.");
    }

    var E = GroupElement.from_bytes(buffer.slice(0, ge_size));
    var V = GroupElement.from_bytes(buffer.slice(ge_size, 2*ge_size));
    var S = Scalar.from_bytes(buffer.slice(2*ge_size, 2*ge_size+sc_size));
    var XG = undefined;
    if (re_encrypted){
        XG = GroupElement.from_bytes(buffer.slice(2*ge_size+sc_size, 3*ge_size+sc_size));
    }
    return new Capsule(E, V, S, XG, re_encrypted);
 
}

Capsule.prototype.to_bytes = function(){
    var bytearray_E = this.get_E().to_bytes();
    var bytearray_V = this.get_V().to_bytes();
    var bytearray_S = this.get_S().to_bytes();
    var bytearray_XG = [];
    if (this.is_re_encrypted()){
        bytearray_XG = this.get_XG().to_bytes();
    }
    return bytearray_E.concat(bytearray_V, bytearray_S, bytearray_XG); 
}
