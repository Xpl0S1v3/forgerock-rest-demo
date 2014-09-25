# ForgeRock Common REST Demo

This demonstrates use of the ForgeRock
[JSON Resource Servlet](http://commons.forgerock.org/forgerock-rest/json-resource-servlet/)
by a browser-based application.

To try the demo:

1.  Clone the workspace locally.
2.  Run the demo with the following ugly command
    that compiles project code,
    runs Jetty in the background sleeping until Jetty starts,
    and then adds some users and groups for the demo.

    If the command to add users and groups fails
    because Jetty has not started yet when it runs,
    then change the time for `sleep 20` command
    to wait more than 20 seconds before adding users and groups.

		mvn clean install && mvn jetty:run & \
		sleep 20 ; mvn exec:java \
		-Dexec.mainClass=org.forgerock.commons.doc.Main \
		-Dexec.args="./Users.json ./Groups.json" ; \
		fg

    Jetty listens at `localhost:8080`.
    If port 8080 is not free, you can specify a different port.
    For example, `mvn -Djetty.port=9080 jetty:run`.

3.  Access the demo at <http://localhost:8080/demo/>.
4.  When finished, stop the demo with Ctrl+C.

The ForgeRock browser-based user interface makes much more interesting use
of the REST APIs exposed in ForgeRock products.
This demo uses the common REST API in simple ways.


* * * * *

This work is licensed under the Creative Commons
Attribution-NonCommercial-NoDerivs 3.0 Unported License.
To view a copy of this license, visit
<http://creativecommons.org/licenses/by-nc-nd/3.0/>
or send a letter to Creative Commons, 444 Castro Street,
Suite 900, Mountain View, California, 94041, USA.

Copyright 2012-2014 ForgeRock AS
