$(function(){

	console.log("Loading random fontawesome icons");
	
	function loadIcons() {
		$.getJSON( "/api/students/", function( students ) {
			console.log(students);
			var message = "Nobody is here";
			if( students.length > 0 ){
				message = students[0].firstName + " " + students[0].lastName;
			}
			$(".font-weight-light").(message);
		});
	};
	loadIcons();
	setInterval(loadIcons, 3500);
});
