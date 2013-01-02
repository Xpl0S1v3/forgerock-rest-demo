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
 * Utility functions for ForgeRock common REST demo.
 */

// Get groups and users from JSON files in the same directory as this page.
var groups = "";
var users = "";
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

// Use the common REST API to create groups.
// Calling this repeatedly should cause a bunch of HTTP 409 Conflicts.
function provisionGroups(logId) {
    setGroups();

    var collection = JSON.parse(getGroups());
    for (var i = 0; i < collection.length; i++) {
        var group = collection[i];
        var resource = getGroupContainer() + collection[i].name;
        var result = create(group, resource);
        writeLog(logId, result);
    }
}

// Use the common REST API to create users.
// Calling this repeatedly should cause a bunch of HTTP 409 Conflicts.
function provisionUsers(logId) {
    setUsers();

    var collection = JSON.parse(getUsers());
    for (var i = 0; i < collection.length; i++) {
        var user = collection[i];
        var resource = getUserContainer() + collection[i].uid;
        var result = create(user, resource);
        writeLog(logId, result);
    }
}

// Create user based on a form having prefixed field names.
// Log results to the element with id = logId.
function createUser(form, prefix, logId) {
    try {
        var myUser = new User(
            form[prefix + "mail"].value,
            form[prefix + "firstname"].value,
            form[prefix + "lastname"].value,
            form[prefix + "userpassword"].value,
            form[prefix + "phone"].value,
            form[prefix + "fax"].value,
            form[prefix + "room"].value,
            form[prefix + "location"].options[form[prefix + "location"].selectedIndex].value,
            form[prefix + "homeDirectory"].value,
            form[prefix + "uidNumber"].value,
            form[prefix + "gidNumber"].value
        );

        var resource = getUserContainer() + myUser.uid;
        var result = create(myUser, resource);
        writeLog(logId, result);
    } catch (err) {
        writeLog(logId, "Create failed: " + err)
    }
}

// Create group based on a form having prefixed field names.
// Log results to the element with id = logId.
function createGroup(form, prefix, logId) {
    var members = [];
    for (var i = 0; i < form[prefix + "users"].options.length; i++) {
        if (form[prefix + "users"].options[i].selected) {
            members.push(form[prefix + "users"].options[i].value);
        }
    }

    try {
        var myGroup = new Group(
            form[prefix + "name"].value,
            form[prefix + "description"].value,
            members
        );
        var resource = getGroupContainer() + myGroup.name;
        console.log(myGroup);
        var result = create(myGroup, resource);
        writeLog(logId, result);
    } catch (err) {
        writeLog(logId, "Create failed: " + err);
    }
}

// Retrieve a user from the JSON Resource Servlet.
function readUser(id) {
    var resource = getUserContainer() + id;
    var result = read(resource);
    return JSON.parse(result);
}

// Get the index of a selected location (as it appears in a <option>s list).
function getLocIndex(location) {
    if (location == "Cupertino") { return 1; }
    if (location == "Paris") { return 2; }
    if (location == "Santa Clara") { return 3; }
    if (location == "Sunnyvale") { return 4; }
    return 0;
}

// Populate a user form based on the value from a <select> list.
// The <select> id is prefix + listId.
function selectUserFromList(form, prefix, listId) {
    var list = document.getElementById(prefix + listId);
    var id = list.options[list.selectedIndex].value;
    var user = readUser(id);

    // Populate form for updating.
    form[prefix + "userId"].value = user._id;
    form[prefix + "userVersion"].value = user._rev;

    form[prefix + "mail"].value = user.mail;
    form[prefix + "firstname"].value = user.firstname;
    form[prefix + "lastname"].value = user.lastname;
    form[prefix + "userpassword"].value = user.userpassword;
    form[prefix + "phone"].value = user.phone;
    form[prefix + "fax"].value = user.fax;
    form[prefix + "room"].value = user.room;
    form[prefix + "location"].options[getLocIndex(user.location)].selected = true;
    form[prefix + "homeDirectory"].value = user.homeDirectory;
    form[prefix + "uidNumber"].value = user.uidNumber;
    form[prefix + "gidNumber"].value = user.gidNumber;
}

// Clear user form fields, where field names start with prefix.
function clearUserForm(form, prefix) {
    form[prefix + "userId"].value = "";
    form[prefix + "userVersion"].value = "";

    form[prefix + "mail"].value = "";
    form[prefix + "firstname"].value = "";
    form[prefix + "lastname"].value = "";
    form[prefix + "userpassword"].value = "";
    form[prefix + "phone"].value = "";
    form[prefix + "fax"].value = "";
    form[prefix + "room"].value = "";
    form[prefix + "location"].options.selectedIndex = 0;
    form[prefix + "homeDirectory"].value = "";
    form[prefix + "uidNumber"].value = "";
    form[prefix + "gidNumber"].value = "";
}

// Update a user in JSON Resource Servlet based on the content of a form.
// Form fields start with prefix.
// Log results to element with id = logId.
function updateUser(form, prefix, logId) {
    var myUser;
    try {
        myUser = new User(
            form[prefix + "mail"].value,
            form[prefix + "firstname"].value,
            form[prefix + "lastname"].value,
            form[prefix + "userpassword"].value,
            form[prefix + "phone"].value,
            form[prefix + "fax"].value,
            form[prefix + "room"].value,
            form[prefix + "location"].options[form[prefix + "location"].selectedIndex].value,
            form[prefix + "homeDirectory"].value,
            form[prefix + "uidNumber"].value,
            form[prefix + "gidNumber"].value
        );
    } catch (err) {
        writeLog(logId, "Update failed: " + err);
        return;
    }

    var resource = getUserContainer() + form[prefix + "userId"].value;
    var result = update(myUser, form[prefix + "userVersion"].value, resource);
    writeLog(logId, result);
    clearUserForm(form, prefix);
}

// Retrieve a group from JSON Resource Servlet.
function readGroup(name) {
    var resource = getGroupContainer() + name;
    var result = read(resource);
    return JSON.parse(result);
}

// Populate <option> elements of a <select> list with members.
function populateMemberList(members, listId) {
    var list = document.getElementById(listId);

    // Sort users by fullname, which is an array.
    var options = queryObjects(getUsersURL(), [])
        .sort(function(a,b){ return a.fullname[0].toString()
            .localeCompare(b.fullname[0].toString()) });

    if (options.length > 0) { empty(list); }

    for (var i = 0; i < options.length; i++) {
        var element = document.createElement("option");
        element.textContent = options[i].fullname[0];
        element.value = options[i].uid;
        for(var j = 0; j < members.length; j++) {
            if (element.value == members[j]) {
                element.selected = "selected";
            }
        }
        list.appendChild(element);
    }
}

// Populate a group form based on the value from a <select> list.
// The <select> id is prefix + listId.
// Members, including selected, are in element with id = prefix + memberListId.
function selectGroupFromList(form, prefix, listId, memberListId) {
    var list = document.getElementById(prefix + listId);
    var id = list.options[list.selectedIndex].value;
    var group = readGroup(id);

    // Populate form for updating.
    form[prefix + "groupId"].value = group._id;
    form[prefix + "groupVersion"].value = group._rev;

    form[prefix + "name"].value = group.name;
    form[prefix + "description"].value = group.description;
    populateMemberList(group.members, prefix + memberListId);
}

// Update a group in JSON Resource Servlet based on the content of a form.
// Form fields start with prefix.
// Log results to element with id = logId.
function updateGroup(form, prefix, logId) {
    var myGroup;

    var members = [];
    for (var i = 0; i < form[prefix + "members"].options.length; i++) {
        if (form[prefix + "members"].options[i].selected) {
            members.push(form[prefix + "members"].options[i].value);
        }
    }

    try {
        myGroup = new Group(
            form[prefix + "name"].value,
            form[prefix + "description"].value,
            members
        );
    } catch (err) {
        writeLog(logId, "Update failed: " + err);
    }

    var resource = getGroupContainer() + form[prefix + "groupId"].value;
    var result = update(myGroup, form[prefix + "groupVersion"].value, resource);
    writeLog(logId, result);
}

// List users by their user ID strings in sorted order.
// Log results to element with id = logId.
function listUsersByUid(logId) {
    // Sort users by uid, which is a string
    var array = queryObjects(getUsersURL(), [])
        .sort(function(a,b){ return a.uid.toString()
            .localeCompare(b.uid.toString()) });
    var list = "";
    for (var i = 0; i < array.length; i++) {
        list = list + array[i].uid + "\n";
    }
    writeLog(logId, list);
}

// Delete a user taking the user ID from a form.
// Form fields start with prefix.
// Log results to element with id = logId.
function deleteUser(form, prefix, logId) {
    var resource = getUserContainer() + form[prefix + "uid"].value;
    var result = remove(resource);
    writeLog(logId, result);
}

// Populate a <select> element with user name <option> elements.
function populateUserList(listId) {
    var list = document.getElementById(listId);

    // Sort users by fullname, which is an array.
    var options = queryObjects(getUsersURL(), [])
        .sort(function(a,b){ return a.fullname[0].toString()
            .localeCompare(b.fullname[0].toString()) });

    if (options.length > 0) { empty(list); }

    for (var i = 0; i < options.length; i++) {
        var element = document.createElement("option");
        element.textContent = options[i].fullname[0];
        element.value = options[i].uid;
        list.appendChild(element);
    }
}

// List groups by their names in sorted order.
// Log results to element with id = logId.
function listGroupsByName(logId) {
    // Sort groups by name, which is a string
    var array = queryObjects(getGroupsURL(), [])
        .sort(function(a,b){ return a.name.toString()
            .localeCompare(b.name.toString()) });
    var list = "";
    for (var i = 0; i < array.length; i++) {
        list = list + array[i].name + "\n";
    }
    writeLog(logId, list);
}

// Delete a user taking the user ID from a <select> list.
// Log results to element with id = logId.
function deleteUserFromList(listId, logId) {
    var list = document.getElementById(listId);
    var id = list.options[list.selectedIndex].value;
    var resource = getUserContainer() + id;
    var result = remove(resource);
    writeLog(logId, result);
}

// Delete a group taking the name from a form.
// Form fields start with prefix.
// Log results to element with id = logId.
function deleteGroup(form, prefix, logId) {
    var resource = getGroupContainer() + form[prefix + "name"].value;
    var result = remove(resource);
    writeLog(logId, result);
}

// Populate a <select> element with group name <option> elements.
function populateGroupList(listId) {
    var list = document.getElementById(listId);

    // Sort groups by name, which is a string
    var options = queryObjects(getGroupsURL(), [])
        .sort(function(a,b){ return a.name.toString()
            .localeCompare(b.name.toString()) });

    if (options.length > 0) { empty(list); }

    for (var i = 0; i < options.length; i++) {
        var element = document.createElement("option");
        element.textContent = options[i].name;
        element.value = options[i].name;
        list.appendChild(element);
    }
}

// Delete a group taking the name from a <select> list.
// Log results to element with id = logId.
function deleteGroupFromList(listId, logId) {
    var list = document.getElementById(listId);
    var id = list.options[list.selectedIndex].value;
    var resource = getGroupContainer() + id;
    var result = remove(resource);
    writeLog(logId, result);
}

// Return a table of one user, based on fields selected on form.
// Form fields start with prefix.
// Display results to element with id = tableId.
function writeUserTable(form, prefix, listId, tableId) {
    var list = document.getElementById(prefix + listId);
    var id = list.options[list.selectedIndex].value;

    var fields = [];
    if (form[prefix + "all"].checked) {
        // No fields specified means get all fields.
    } else {
        if (form[prefix + "mail"].checked) { fields.push("mail"); }
        if (form[prefix + "fullname"].checked) { fields.push("fullname"); }
        if (form[prefix + "phone"].checked) { fields.push("phone"); }
    }

    var resource = getUserContainer() + id;
    var user = JSON.parse(read(resource, fields));
    writeTable(tableId, [user]);
}

// Return a table of all users, based on fields selected on form.
// Form fields start with prefix.
// Display results to element with id = tableId.
function writeUsersTable(form, prefix, tableId) {
    var fields = [];
    if (form[prefix + "all"].checked) {
        // No fields specified means get all fields.
    } else {
        if (form[prefix + "mail"].checked) { fields.push("mail"); }
        if (form[prefix + "fullname"].checked) { fields.push("fullname"); }
        if (form[prefix + "phone"].checked) { fields.push("phone"); }
    }

    writeTable(tableId, queryObjects(getUsersURL(), fields)
        .sort(function(a,b){ return a.fullname[0].toString()
            .localeCompare(b.fullname[0].toString()) }));
}

// Return a table of one group.
// Form fields start with prefix.
// Display results to element with id = tableId.
function writeGroupTable(form, prefix, listId, tableId) {
    var list = document.getElementById(prefix + listId);
    var id = list.options[list.selectedIndex].value;

    var fields = ["name" , "members" , "description"];
    var resource = getGroupContainer() + id;
    var group = JSON.parse(read(resource, fields));

    // Display user names instead of user IDs.
    var names = "";
    if (group.members.length > 0) {
        names = getUserName(group.members[0]);
        for (var i = 1; i < group.members.length; i++) {
            names = names + "<br />" + getUserName(group.members[i]);
        }
    }
    group.members = names;
    writeTable(tableId, [group]);
}

// Return a table of all groups, based on fields selected on form.
// Form fields start with prefix.
// Display results to element with id = tableId.
function writeGroupsTable(form, prefix, tableId) {
    var fields = [];
    if (form[prefix + "name"].checked) { fields.push("name"); }
    if (form[prefix + "members"].checked) { fields.push("members"); }
    if (form[prefix + "description"].checked) { fields.push("description"); }

    var groups = queryObjects(getGroupsURL(), fields);

    // Display user names instead of user IDs.
    for (var i = 0; i < groups.length; i++) {
        var names = "";
        if (groups[i].members.length > 0) {
            names = getUserName(groups[i].members[0]);
            for (var j = 1; j < groups[i].members.length; j++) {
                names = names + "<br />" + getUserName(groups[i].members[j]);
            }
        }
        groups[i].members = names;
    }

    writeTable(tableId, groups.sort(function(a,b){
        return a.name.toString().localeCompare(b.name.toString()) }));
}

// JSON Resource Servlet deployed under /json, at http://host:port/json.
function getServletURL() {
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    return protocol + "//" + hostname + ":" + port + "/json";
}

// Return the URL to the /groups endpoint, such as http://host:port/json/groups.
function getGroupsURL() { return getServletURL() + "/groups"; }

// Return the group container, such as http://host:port/json/groups/.
function getGroupContainer() { return getGroupsURL() + "/"; }

// Return the URL to the /users endpoint, such as http://host:port/json/users.
function getUsersURL() { return getServletURL() + "/users"; }

// Return the user container, such as http://host:port/json/users/.
function getUserContainer() { return getUsersURL() + "/"; }

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
}

// Create a user object.
function User(mail, first, last, pwd, tel, fax, room, loc, home, uid, gid) {
    // { "uid": string, "mail": string, "firstname": string, "lastname": string,
    //   "fullname": array, "userpassword": string,
    //   "phone": string, "fax": string, "room": int, "location": string,
    //   "homeDirectory": string, "uidNumber": int, "gidNumber": int };

    if (typeof mail === 'undefined' || mail == "") {
        throw "User mail address is required.";
    } else {
        var userId = mail.substring(0, mail.lastIndexOf('@'));
        this.uid = userId;
        this.mail = mail;
    }

    if (typeof first === 'undefined' || first == "") {
        throw "User first name is required.";
    } else {
        this.firstname = first;
    }

    if (typeof last === 'undefined' || last == "") {
        throw "User last name is required.";
    } else {
        this.lastname = last;
        this.fullname = [first + " " + last];
    }

    if (typeof pwd === 'undefined') {
        this.userpassword = "";
    } else {
        this.userpassword = pwd;
    }

    if (typeof tel === 'undefined') {
        this.phone = "";
    } else {
        this.phone = tel;
    }
    if (typeof fax === 'undefined') {
        this.fax = "";
    } else {
        this.fax = fax;
    }

    if (typeof room === 'undefined') {
        this.room = -1;
    } else {
        this.room = parseInt(room);
    }

    if (typeof loc === 'undefined' || loc == 'Select Location') {
        this.location = "Paris";
    } else {
        this.location = loc;
    }

    if (typeof home === 'undefined') {
        this.homeDirectory = "";
    } else {
        this.homeDirectory = home;
    }
    if (typeof uid === 'undefined') {
        this.uidNumber = -1;
    } else {
        this.uidNumber = parseInt(uid);
    }
    if (typeof gid === 'undefined') {
        this.gidNumber = -1;
    } else {
        this.gidNumber = parseInt(gid);
    }
}

// Create a group object.
function Group(name, description, members) {
    // { "name": string, "description": string, "members": array };

    if (typeof name === 'undefined' || name == "") {
        throw "Group name is required.";
    } else {
        this.name = name;
    }

    if (typeof description === 'undefined') {
        this.description = "";
    } else {
        this.description = description;
    }

    this.members = [];
    if (typeof members === 'undefined') {
        // Leave members empty.
    } else {
        for (var i = 0; i < members.length; i++) {
            this.members.push(members[i]);
        }
    }
}

// Capitalize first letter.
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// Return a <tr> with <th> for each field of an object.
function getHeaderRow(object) {
    var cells = "";
    for (var prop in object) {
        cells = cells + "<th>" + prop.capitalize() + "</th>";
    }
    return "<tr>" + cells + "</tr>";
}

// Return a <tr> with <td> for each field of an object.
function getDataRow(object) {
    var cells = "";
    for (var prop in object) {
        cells = cells + "<td>" + object[prop] + "</td>";
    }
    return "<tr>" + cells + "</tr>";
}

// Build and return a table of objects such as users or groups.
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
    return JSON.parse(read(getUserContainer() + id, ["fullname"])).fullname;
}

// Write a log message into a <div id="logId"></div>.
function writeLog(logId, message) {
    document.getElementById(logId).innerHTML = "<h3>Log Message</h3>"
        + preWrap(message);
}

// Write a table into a <div id="tableId"></div>.
function writeTable(tableId, array) {
    document.getElementById(tableId).innerHTML = getTable(array);
}
