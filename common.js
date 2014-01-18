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
 * Copyright © 2012-2014 ForgeRock AS. All rights reserved.
 */

/**
 * Functions to access ForgeRock common REST API.
 */

/*global JSON, XMLHttpRequest, create, read, update, remove, queryObjects */

var create, read, update, remove, queryObjects;

// Create a resource putting an object to a resource URL, specifying the ID.
create = function (object, uri) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', uri, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("If-None-Match", "*");
    xhr.send(JSON.stringify(object));
    return xhr.responseText;
};

// Read a resource based on a resource URL.
// The optional fields takes an array of field names, such as uid and mail
// for users, or name and members for groups.
read = function (uri, fields) {
    "use strict";
    var args, i, xhr;
    fields = fields || [];

    args = "";
    if (fields.length > 0) {
        args = "?_fields=" + fields[0];
        for (i = 1; i < fields.length; i += 1) {
            args = args + "," + fields[i];
        }
    }
    uri = uri + args;

    xhr = new XMLHttpRequest();
    xhr.open('GET', uri, false);
    xhr.send("");
    return xhr.responseText;
};

// Update a resource.
update = function (object, revision, uri) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', uri, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("If-Match", revision);
    xhr.send(JSON.stringify(object));
    return xhr.responseText;
};

// Delete a resource based on a resource URL that specifies the ID.
// This function is called remove because delete is a reserved word.
remove = function (uri) {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', uri, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("");
    return xhr.responseText;
};

// Return an array of user or group objects.
// The resource takes a collection resource like http://host:/port/json/users,
// or http://host:/port/json/groups.
// The optional fields takes an array of field names, such as uid and mail
// for users, or name and members for groups.
queryObjects = function (uri, fields) {
    "use strict";
    var query, args, i, xhr, allObjects;
    fields = fields || [];

    query = uri + "?_queryFilter=true";
    args = "";
    if (fields.length > 0) {
        args = "&_fields=" + fields[0];
        for (i = 1; i < fields.length; i += 1) {
            args = args + "," + fields[i];
        }
        query = query + args;
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', query, false);
    xhr.send("");

    allObjects = [];
    if (xhr.status === 200) { // OK
        allObjects = JSON.parse(xhr.responseText);
        if (allObjects.result.length > 0) {
            allObjects = allObjects.result;
        } else {
            allObjects = [];
        }
    }
    return allObjects;
};
