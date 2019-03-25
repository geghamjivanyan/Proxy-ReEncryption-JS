function private_public_key(prvKey)
{
    console.log("prvKey - ", prvKey);
    var sk = Proxy.private_key_from_bytes(from_hex(prvKey));

    var pk = sk.get_public_key();
    console.log("PK - ", to_hex(pk.to_bytes()));

}

function decapsulate_original(prvKey, cps){
    console.log("prvKey - ", prvKey);
    var sk = Proxy.private_key_from_bytes(from_hex(prvKey));
    
    console.log("capsule - ", cps);
    var capsule = Proxy.capsule_from_bytes(from_hex(cps));

    var sym_key = Proxy.decapsulate(capsule, sk);
    console.log("SYM KEY - ", to_hex(sym_key.to_bytes()));
    return to_hex(sym_key.to_bytes());
}

window.onload = function() {
		var prvfileInput = document.getElementById('prvfileInput');
		var capsulefileInput = document.getElementById('capsulefileInput');
                
		var prvfileDisplayArea = document.getElementById('prvfileDisplayArea');
		var capsulefileDisplayArea = document.getElementById('capsulefileDisplayArea');

                var prvKey = null;

		prvfileInput.addEventListener('change', function(e) {

			var file = prvfileInput.files[0];
			var textType = /text.*/;
                        console.log("FILE - ", file);
			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					prvfileDisplayArea.innerText = reader.result;
                                        prvKey = reader.result;
                                        private_public_key(prvKey);
				}
				reader.readAsText(file);	
			} else {
				fileDisplayArea.innerText = "File not supported!";
			}
		});
		capsulefileInput.addEventListener('change', function(e) {

			var file = capsulefileInput.files[0];
			var textType = /text.*/;
                        console.log("FILE - ", file);
			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
                                        var sym_key = decapsulate_original(prvKey, reader.result);
					capsulefileDisplayArea.innerText = sym_key;
				}
				reader.readAsText(file);	
			} else {
				capsulefileDisplayArea.innerText = "File not supported!";
			}
		});
}
