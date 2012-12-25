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
 * Provision users and groups for ForgeRock common REST demo.
 */

// Get groups and users from JSON files in the same directory as this page.
var groups = "groups";
var users = "users";

function getGroups() { return groups; }
function setGroups() { groups = getJSON("Groups.json"); }
function getUsers() { return users;}
function setUsers() { users = getJSON("Users.json"); }
function getJSON(file) {
    var resource = getDemoBase() + "/" + file;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', resource, false);
    xhr.send("");

    var response = "";
    if (xhr.status === 200) { // OK
        response = xhr.responseText;
    }
    return response;
}

// Use the common REST API to create users and groups.
// Calling these repeatedly should cause a bunch of HTTP 409 Conflicts.
function provisionGroups() {
    setGroups();

    var collection = JSON.parse(getGroups());
    for (var i = 0; i < collection.groups.length; i++) {
        var group = collection.groups[i];
        var resource = getServletURL() + "/groups/"
            + collection.groups[i].name;
        var result = create(group, resource);
        document.getElementById("provisioning-log").innerHTML = preWrap(result);
    }
}

function provisionUsers() {
    setUsers();

    var collection = JSON.parse(getUsers());
    for (var i = 0; i < collection.users.length; i++) {
        var user = collection.users[i];
        var resource = getServletURL() + "/users/" + collection.users[i].uid;
        var result = create(user, resource);
        document.getElementById("provisioning-log").innerHTML = preWrap(result);
    }
}
