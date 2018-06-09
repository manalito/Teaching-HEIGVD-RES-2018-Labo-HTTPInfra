<?php 
	$static_app = getenv('STATIC_APP');
	$dynamic_app = getenv('DYNAMIC_APP');
?>

<Virtualhost *:80>
	ServerName http-reslab.ch

	#ErrorLog
	#CustomLog

	ProxyPass '/api/students/' 'http://<?php print "$dynamic_app"?>/'
	ProxyPassReverse '/api/students/' 'http://<?php print "$dynamic_app"?>/'

	ProxyPass '/' 'http://<?php print "$static_app"?>/'
	ProxyPassReverse '/' 'http://1<?php print "$static_app"?>/'

</VirtualHost>

<?php print "hello $ip_address"?>