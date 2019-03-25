/**
 * \brief Elliptic curve Point class implementation based elliptic lib
 */

function GroupElement(point, curve){
    this._ec_point = point; // ECPoint
    this._curve = curve;
}

GroupElement.expected_byte_length = function(curve /* Curve */, is_compressed){
    if (typeof curve == "undefined"){
        curve = default_curve();
    }
    if (is_compressed){
        return 1 + curve.order_size();
    }
    else{
        return 1 + 2*curve.order_size();
    }
}
 
GroupElement.generate_random = function(curve){
    if (typeof curve == "undefined"){
        curve = default_curve();
    }
    return new GroupElement(curve.generator().mul(Scalar.generate_random().valueOf()));
}


GroupElement.from_bytes = function(buffer){
    var ge_size = GroupElement.expected_byte_length();
    if (buffer.length != ge_size){
        throw new Error("Invalid length of data.");
    }
    var sc_size = Scalar.expected_byte_length();
    var x = buffer.slice(1, sc_size+1);
    var y = buffer.slice(sc_size+1, ge_size);
    return new GroupElement(default_curve()._curve.curve.point(x,y));  
}

GroupElement.prototype.to_bytes = function(){
    var x = this._ec_point.getX().toArray();
    var y = this._ec_point.getY().toArray();
    return [0x04].concat(x,y);
}

GroupElement.prototype.valueOf = function(){ return this._ec_point; }

GroupElement.prototype.add = function(ge /* GroupElement */) { return new GroupElement(this.valueOf().add(ge.valueOf()));} 
GroupElement.prototype.mul = function(sc /* Scalar */) { return new GroupElement(this.valueOf().mul(sc.valueOf()));}
GroupElement.prototype.eq  = function(ge /* GroupElement */) { return this.valueOf().eq(ge.valueOf());}
