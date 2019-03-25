function hex_to_point(p1)
{
    console.log("p - ", p1);
    var p = GroupElement.from_bytes(from_hex(p1));

    console.log("p_b - ", to_hex(p.to_bytes()));

}

window.onload = function() {
		var point_1 = document.getElementById('point_1');
		var point_2 = document.getElementById('point_2');
		var point_3 = document.getElementById('point_3');
                
		var pointDisplayArea_1 = document.getElementById('pointDisplayArea_1');
		var pointDisplayArea_2 = document.getElementById('pointDisplayArea_2');
		var pointDisplayArea_3 = document.getElementById('pointDisplayArea_3');

                var p1 = null;
                var p2 = null;
                var p3 = null;

		point_1.addEventListener('change', function(e) {

			var file = point_1.files[0];
			var textType = /text.*/;
                        console.log("FILE - ", file);
			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					pointDisplayArea_1.innerText = reader.result;
                                        p1 = reader.result;
                                        hex_to_point(p1);
				}
				reader.readAsText(file);	
			} else {
				fileDisplayArea.innerText = "File not supported!";
			}
		});
		point_2.addEventListener('change', function(e) {

			var file = point_2.files[0];
			var textType = /text.*/;
                        console.log("FILE - ", file);
			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					pointDisplayArea_2.innerText = reader.result;
                                        p2 = reader.result;
                                        hex_to_point(p2);
				}
				reader.readAsText(file);	
			} else {
				fileDisplayArea.innerText = "File not supported!";
			}
		});
		point_3.addEventListener('change', function(e) {

			var file = point_3.files[0];
			var textType = /text.*/;
                        console.log("FILE - ", file);
			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					pointDisplayArea_3.innerText = reader.result;
                                        p3 = reader.result;
                                        hex_to_point(p3);
                                        var sc = hash_to_scalar([GroupElement.from_bytes(from_hex(p1)), GroupElement.from_bytes(from_hex(p2)), GroupElement.from_bytes(from_hex(p3))]);
                                        console.log("SC - ", to_hex(sc.to_bytes()));
				}
				reader.readAsText(file);	
			} else {
				fileDisplayArea.innerText = "File not supported!";
			}
		});
}
