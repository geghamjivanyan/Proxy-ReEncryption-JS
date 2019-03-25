

function Config(curve /* Curve */){
    this._curve = curve;
    this._default_curve = new Curve();
}

Config.prototype.set_curve_by_default = function() {
    this.set_curve(this._default_curve)
}

Config.prototype.set_curve = function(curve){
    if (typeof curve == "undefined"){
        curve = this._default_curve;
    }
    this._curve = curve;
}

Config.prototype.curve = function (){
    if (typeof this._curve == "undefined"){
        this.set_curve_by_default();
    }
    return this._curve;
}

function default_curve(){
    var config = new Config();
    config.set_curve_by_default();
    return config.curve();
}
