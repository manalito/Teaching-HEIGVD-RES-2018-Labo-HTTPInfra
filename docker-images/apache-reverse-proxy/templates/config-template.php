<?php 
	$static_app = getenv('STATIC_APP');
	$dynamic_app = getenv('DYNAMIC_APP');
?>

<Virtualhost *:80>
	ServerName http-reslab.ch

	#ErrorLog
	#CustomLog

	ProxyPass '/api/font-icons/' 'http://<?php print "$dynamic_app"?>/'
	ProxyPassReverse '/api/font-icons/' 'http://<?php print "$dynamic_app"?>/'

	ProxyPass '/' 'http://<?php print "$static_app"?>/'
	ProxyPassReverse '/' 'http://<?php print "$static_app"?>/'

</VirtualHost>
