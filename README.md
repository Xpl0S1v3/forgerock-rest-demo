# ForgeRock Common REST Demo

This demonstrates use of the ForgeRock
[JSON Resource Servlet](http://commons.forgerock.org/forgerock-rest/json-resource-servlet/)
by a browser-based application.

To try the demo:

1.  Clone the workspace locally.
2.  Run the demo with `mvn jetty:run`.
3.  In another terminal window, provision with users and groups,
    `mvn exec:java -Dexec.mainClass=org.forgerock.commons.doc.Main -Dexec.args="./Users.json ./Groups.json"`.
3.  Access the demo at <http://localhost:8080/demo/>.

The ForgeRock browser-based user interface makes much more interesting use of the REST APIs exposed in ForgeRock products. This demo uses the common REST API in simple ways.


* * *
This work is licensed under the Creative Commons
Attribution-NonCommercial-NoDerivs 3.0 Unported License.
To view a copy of this license, visit
<http://creativecommons.org/licenses/by-nc-nd/3.0/>
or send a letter to Creative Commons, 444 Castro Street,
Suite 900, Mountain View, California, 94041, USA.

Copyright 2012-2014 ForgeRock AS
