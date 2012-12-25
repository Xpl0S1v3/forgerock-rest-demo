/*
 * The contents of this file are subject to the terms of the Common Development and
 * Distribution License (the License). You may not use this file except in compliance with the
 * License.
 *
 * You can obtain a copy of the License at legal/CDDLv1.0.txt. See the License for the
 * specific language governing permission and limitations under the License.
 *
 * When distributing Covered Software, include this CDDL Header Notice in each file and include
 * the License file at legal/CDDLv1.0.txt. If applicable, add the following below the CDDL
 * Header, with the fields enclosed by brackets [] replaced by your own identifying
 * information: "Portions Copyrighted [year] [name of copyright owner]".
 *
 * Copyright © 2012 ForgeRock AS. All rights reserved.
 */

/**
 * Demo access to ForgeRock json-resource-servlet.
 */

/* Create user */
// Let the resource assign an ID:
// $ curl --request POST  --header "Content-Type: application/json" --data '{ "uid": "bjensen", "fullname": ["Babs Jensen", "Barbara Jensen"], "mail": "bjensen@example.com" }' http://localhost:8080/json/users?_action=create
// {"uid":"bjensen","fullname":["Babs Jensen","Barbara Jensen"],"mail":"bjensen@example.com","_id":"0","_rev":"0"}

// Choose the ID in advance:
// curl --request PUT  --header "Content-Type: application/json" --header "If-None-Match: *" --data '{ "uid": "kvaughan", "fullname": ["Kirsten Vaughan"], "mail": "kvaughan@example.com" }' http://localhost:8080/json/users/kvaughan
// {"uid":"kvaughan","fullname":["Kirsten Vaughan"],"mail":"kvaughan@example.com","_id":"kvaughan","_rev":"0"}

/* Read user */
// curl http://localhost:8080/json/users/0
// {"uid":"bjensen","fullname":["Babs Jensen","Barbara Jensen"],"mail":"bjensen@example.com","_id":"0","_rev":"0"}
// curl http://localhost:8080/json/users/kvaughan
// {"uid":"kvaughan","fullname":["Kirsten Vaughan"],"mail":"kvaughan@example.com","_id":"kvaughan","_rev":"0"}
// $ curl "http://localhost:8080/json/users/0?_fields=mail,fullname&_prettyPrint=true"
// {
//     "mail" : "bjensen@example.com",
//     "fullname" : [ "Babs Jensen", "Barbara Jensen" ]
// }
// _fields and _prettyPrint are common for all requests.

/* Update user */
// curl --request PUT --header "Content-Type: application/json" --header "If-Match: 0" --data '{ "uid": "kvaughan", "fullname": ["Kirsten Vaughan"], "mail": "kvaughan@example.com", "description": "Employee of the month!" }' http://localhost:8080/json/users/kvaughan
// {"uid":"kvaughan","fullname":["Kirsten Vaughan"],"mail":"kvaughan@example.com","description":"Employee of the month!","_id":"kvaughan","_rev":"1"}

/* Delete user */
// curl --request DELETE http://localhost:8080/json/users/kvaughan
// {"uid":"kvaughan","fullname":["Kirsten Vaughan"],"mail":"kvaughan@example.com","description":"Employee of the month!","_id":"kvaughan","_rev":"1"}

/* Patch user */
// Not implemented

/* Actions */
// Only create, read, update, delete, patch, query by default. Works with POST.
// For example, /users?_action=create

/* Query collection */
// curl http://localhost:8080/json/users?_queryId=all
// {"result":[{"uid":"bjensen","fullname":["Babs Jensen","Barbara Jensen"],"mail":"bjensen@example.com","_id":"0","_rev":"0"}],"pagedResultsCookie":null,"remainingPagedResults":-1}
// Other parameters:
// _filter=FILTER, where the filter is TBD
// _sortKeys=[+-]FIELD,..., where + is encoded as %2B
// _pagedResultsCookie=STRING
// _pageSize=INTEGER
// _queryId=ID to trigger a stored query, also takes arg1=value1 to argN=valueN
