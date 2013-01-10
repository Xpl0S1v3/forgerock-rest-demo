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
 * Functions to access ForgeRock common REST API.
 */

// Create a resource putting an object to a resource URL, specifying the ID.
function create(object, resource) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', resource, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("If-None-Match", "*");
    xhr.send(JSON.stringify(object));
    return xhr.responseText;
}

// Read a resource based on a resource URL.
// The optional fields takes an array of field names, such as uid and mail
// for users, or name and members for groups.
function read(resource, fields) {
    fields = (typeof fields === "undefined") ? [] : fields;

    var args = "";
    if (fields.length > 0) {
        args = "?_fields=" + fields[0];
        for (var i = 1; i < fields.length; i++) {
            args = args + "," + fields[i];
        }
    }
    resource = resource + args;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', resource, false);
    xhr.send("");
    return xhr.responseText;
}

// Update a resource.
function update(object, version, resource) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', resource, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("If-Match", version);
    xhr.send(JSON.stringify(object));
    return xhr.responseText;
}

// Delete a resource based on a resource URL that specifies the ID.
// This function is called remove because delete is a reserved word.
function remove(resource) {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', resource, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send("");
    return xhr.responseText;
}

// Return an array of user or group objects.
// The resource takes a collection resource like http://host:/port/json/users,
// or http://host:/port/json/groups.
// The optional fields takes an array of field names, such as uid and mail
// for users, or name and members for groups.
function queryObjects(resource, fields) {
    fields = (typeof fields === "undefined") ? [] : fields;

    var query = resource + "?_filter=true";
    var args = "";
    if (fields.length > 0) {
        args = "&_fields=" + fields[0];
        for (var i = 1; i < fields.length; i++) {
            args = args + "," + fields[i];
        }
        query = query + args;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', query, false);
    xhr.send("");

    var allObjects = [];
    if (xhr.status === 200) { // OK
        allObjects = JSON.parse(xhr.responseText);
        if (allObjects.result.length > 0) {
            allObjects = allObjects.result;
        } else {
            allObjects = [];
        }
    }
    return allObjects;
}
