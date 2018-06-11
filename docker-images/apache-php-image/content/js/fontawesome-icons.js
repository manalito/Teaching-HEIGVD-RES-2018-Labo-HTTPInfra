$(function(){

	console.log("Loading random FontAwesome icons");

	// Replace title of section
	$(".title-icons").text("FontAwesome icons");
	$(".description-icons").text("Displays random FontAwesome icons every 3 seconds and a half");
	
	function loadIcons() {
		$.getJSON( "/api/font-icons/", function( icons ) {
			console.log(icons);
			var iconName = "";
			var iconId = "";

			var iconElement = null;
			var rxp = null;
			var cn = null;
			
			for(var i = 0; i < 3; ++i){
				iconName = icons[i].name;
				iconId = " fa-" + icons[i].id + " ";
				iconElement = document.getElementsByClassName("icon-id" + (i + 1))[0];
				
				cn = iconElement.className;
				rxp = new RegExp( '(?:^|\\s)' + iconElement.classList[2] + '(?:\\s|$)');
    			cn = cn.replace( rxp, iconId );
    			
    			iconElement.className = cn;

    			// Replace the icon title with the name of the icon
				$(".icon-name" + (i+1)).text(iconName);
			}
		});
	};
	loadIcons();
	setInterval(loadIcons, 3500);
});
