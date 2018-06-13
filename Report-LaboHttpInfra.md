# RES Lab: HTTP infra

**Students:** Nathan Flückiger, Siu Aurélien
**Date:** 08. juin 2018

## 

### Part 1: apache-static

In this part, we will build our first docker image that will contain an *Apache*  server.

We will use an already existing image maintained by the Docker community which also contains *PHP*: `php:7.0-apache`

Our Dockerfile look like this:

	FROM php:7.0-apache
	
	COPY content/ /var/www/html/

We will use a bootstrap template in order to have a nice development website.

Here is the source of our bootstrap: https://startbootstrap.com/template-overviews/agency/


To start our docker with a port mapping on 8080:

	$ docker run -d -p 8080:80 res/apache_php

We can get the ip address of our docker container with the following command:
	
	$ docker inspect express-dynamic | grep -i ipaddress

### Part 2: express-app

In this part, we will realize another server application but now with dynamic content.
Our docker image will contain a *Node*  application.

Our node js application require 3 additional modules

- `chance.js`: we use this module because it allow us to easily generate random numbers.
- `express.js`: simple module to build a simple server
- `font-awesome-list`: used to retrieve all fontAwesomeIcons codes

The first thing we do is retrieve all the **FontAwesome Icons**:
	
	// Get all the fontAwesome Icons
	const allIcons = fontAwesomeList.all();

We define the function that will be called when there is a new connection :

	app.get('/', function(req, res){
		res.send(getRandomFontIcons());
	});

We start listening listening http requests on port 3000 

	app.listen(3000, function(req, res){
		console.log('Accepting HTTP requests on port 3000.');
	});


In order to build our image with the name **res/express_dynamic**

	$ docker build -t res/express-lab .
	
We will then run our image 

	$ docker run -d -p 3000:3000 res/express-lab


### Part 3: reverse-proxy

We will now create a third docker image containing a **reverse-proxy server**. We will use the same image as in **Part 1** and bring some configuration in order to activate the proxy options available with **Apache2**

Source: http://linuxwebservers.net/apache/mod-proxy/

The default configuration is done in the file `/etc/apache2/sites-available/000-default.conf`

We will create our own configuration file in the same directory with the name: `001-reverse-proxy.conf`

It will load our static website container when we request directly our domain: http://http-reslab.ch/

And our express-dynamic container when we request our domain: http://http-reslab.ch/api/font-icons/

	<Virtualhost *:80>
		ServerName http-reslab.ch

		#ErrorLog
		#CustomLog

		ProxyPass "/api/font-icons/" "http://172.17.0.3:3000/"
		ProxyPassReverse "/api/font-icons/" "http://172.17.0.3:3000/"

		ProxyPass "/" "http://172.17.0.2:80/"
		ProxyPassReverse "/" "http://172.17.0.2:80/"

	</VirtualHost>

Here is our Dockerfile:

	FROM php:7.0-apache

	COPY conf/ /etc/apache2/

	RUN a2enmod proxy proxy_http
	RUN a2ensite 000-* 001-*

The `COPY` command allow us to copy our configuration files inside the docker container.

Then we run 2 commands :
**a2enmod: **activate the required modules for the proxy configuration.
**a2ensite: ** activate our 2 configuration files (default + our own config).

---

#### Start Dockers


Allow us to launch our `res/apache_php` docker container:

	$ docker run -d --name apache-static res/apache_php

Allow us to launch our `res/express_dynamic` docker container:

	$ docker run -d --name express-dynamic res/express_dynamic

Permet de lancer le docker du reverse-proxy:

	$ docker run -d -p 8080:80 --name apache-reverse-proxy res/apache_rp


We can build our image with the following command:

	$ docker build -t res/apache_rp .
	
We have now a functional reverse-proxy but it is quite fragile: our ip address are hard-written in the configuration file. If we run our dockers in random way, the configuration might not work properly, depending on ip address attributions.

Retrieve ip address of our docker container

	$ docker inspect express-dynamic | grep -i ipaddress


### Part 4: express

In this step, we will implement an ajax request.

In order to do this we will create a new javascript file that will dynamically send http requests to our dynamic container in order to receive and update our html page.

In order to do this correctly we defined new class attributes in our html file in order to access the right elements in our `.js` file:

	<i class="icon-id1 fa fa-shopping-cart fa-stack-1x fa-inverse"></i>
		<h4 class="icon-name1 service-heading">E-Commerce</h4>
	<i class="icon-id2 fa fa-laptop fa-stack-1x fa-inverse"></i>
		<h4 class="icon-name2 service-heading">Responsive Design</h4>
	<i class="icon-id3 fa fa-lock fa-stack-1x fa-inverse"></i>
		<h4 class="icon-name3 service-heading">Web Security</h4>

Our main function in the file `fontawesome-icons.js` will update the icons and their names with ajax requests and DOM access.

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
	
	
Our icons are updated every 3 seconds and a half.

### Part 5: dynamic reverse config

We will now modify our configuration in order to have a dynamic reverse-proxy config.

In order to do this we will use a particular option of the command `docker run`: `-e`

It allows us to set environment variables that will then be used in the apache proxy configuration. 


	$ docker run -d -e STATIC_APP=172.17.0.2:80 -e DYNAMIC_APP=172.17.0.3:3000 res/apache_rp
	
	
	find . -type d | xargs chmod 755
	find . -type f | xargs chmod 644
	

### Load balancing: multiple server nodes ( Part 6)

The load-balancer will allows to spread the load when we have multiple docker instances of a same website.
We will do this with 3 static docker container and 2 dynamic containers.

On a true website infrastructure, this will allows us to avoid overloading of a server because it shares equally the load between all the members of a load-balancer.

source: https://support.rackspace.com/how-to/simple-load-balancing-with-apache/

### Management UI


	
