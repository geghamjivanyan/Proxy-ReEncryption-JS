
var _supported_curves = ['secp256k1'];

function Curve(name){
    if (typeof name == "undefined"){
        name = 'secp256k1';
    }
    var curve = null;
    if (_supported_curves.includes(name)){ 
        curve = secp256k1;
    }
    this._curve = curve;
    this._name = name;
    this._order = curve.curve.n;
    this._generator = curve.curve.g;
    this._order_size = curve.curve.n.byteLength();
}

Curve.prototype.name = function(){ return this._name; }
Curve.prototype.order = function(){ return this._order; }
Curve.prototype.generator = function(){ return this._generator; }
Curve.prototype.order_size = function() { return this._order_size; }
