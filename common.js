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
 * Common functions for ForgeRock common REST demo.
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
function read(resource) {
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
// The endpoint takes a URI as a string, either "/users" or "/groups".
// The optional fields takes an array of field names, such as uid and mail
// for users, or name and members for groups.
function queryObjects(endpoint, fields) {
    var query = getServletURL() + endpoint + "?_queryId=all";

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

// JSON Resource Servlet deployed under /json, at http://host:port/json.
function getServletURL() {
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    return protocol + "//" + hostname + ":" + port + "/json";
}

// Return base URL of demo.
function getDemoBase() {
    return window.location.href.substring(
        0, window.location.href.lastIndexOf('/'));
}

// Prepare string for logging into HTML page.
function preWrap(string) { return "<pre>" + string + "</pre>"}

// Empty DOM node of all children.
function empty(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    return;
}

// Create a user object.
function User(mail, first, last, pwd, tel, fax, room, loc, home, uid, gid) {
    if (mail != null && mail != "") {
        this.uid = mail.substring(0, mail.lastIndexOf('@'));
        this.mail = mail;
    } else {
        return null;
    }

    if (first != null && first != "") { this.firstname = first; }
    if (last != null && last != "") { this.lastname = last; }
    var full = first + last;
    if (full != null && full != "") { this.fullname = [first + " " + last]; }

    if (pwd != null && pwd != "") { this.userpassword = pwd; }

    if (tel != null && tel != "") { this.phone = tel; }
    if (fax != null && fax != "") { this.fax = fax; }

    if (room != null && room != "" ) { this.room = room; }
    if (loc != null && loc != "Select Location") { this.location = loc; }

    if (home != null && home != "") { this.homeDirectory = home; }
    if (uid != null && uid != "") { this.uidNumber = uid; }
    if (gid != null && gid !="" ) { this.gidNumber = gid; }
    return this;
}

// http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Build and return a table of objects such as users or groups.
function getHeaderRow(object) {
    var cells = "";
    for (var prop in object) {
        cells = cells + "<th>" + prop.capitalize() + "</th>";
    }
    return "<tr>" + cells + "</tr>";
}

function getDataRow(object) {
    var cells = "";
    for (var prop in object) {
        cells = cells + "<td>" + object[prop] + "</td>";
    }
    return "<tr>" + cells + "</tr>";
}

function getTable(objects) {
    if (objects.length == 0) { return ""; }

    var rows = getHeaderRow(objects[0]);
    for (var i = 0; i < objects.length; i++) {
        rows = rows + getDataRow(objects[i]);
    }
    return "<table>" + rows + "</table>";
}

// Return a user's full name given the user's ID.
function getUserName(id) {
    return JSON.parse(
            read(getServletURL() + "/users/" + id + "?_fields=fullname"))
        .fullname;
}
