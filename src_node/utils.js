function to_hex(byteArray){
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function from_hex(hexString) {
  var result = [];
  while (hexString.length >= 2) {
    result.push(parseInt(hexString.substring(0, 2), 16));
    hexString = hexString.substring(2, hexString.length);
  }
  return result;
}

/**
 * SHA256
 */
function SHA256(obj){
    var sc =  hash.sha256().update(to_hex(obj.to_bytes())).digest();
    return new Scalar(new BN(sc));
}

/**
 * Concat of hashes of GroupElement's
 * @param points
 * @return 
 */
function hash_to_scalar(points){
    var h = null;
    for (var i = 0; i < points.length; i++){
        h = hash.sha256().update(to_hex(points[i].to_bytes()));
    }
    var points_hash = h.digest(); 
    return new Scalar(new BN(points_hash));        
}
