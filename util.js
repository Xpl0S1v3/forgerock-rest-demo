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
 * Utility functions for ForgeRock common REST demo.
 */

/*global
    Group, JSON, Math, String, User, XMLHttpRequest, clearUserForm,
    console, create, createGroup, createUser, deleteGroup,
    deleteGroupFromList, deleteUser, deleteUserFromList, document,
    empty, getDataRow, getDemoBase, getGroupContainer, getGroups,
    getGroupsURL, getGuid, getHeaderRow, getJSON, getLocIndex,
    getServletURL, getTable, getUserContainer, getUserName, getUsers,
    getUsersURL, groups, idField, listGroupsByName, listUsersByUid, parseInt,
    populateGroupList, populateMemberList, populateUserList, preWrap,
    prettyPrint, provisionGroups, provisionUsers, queryObjects, read,
    readGroup, readUser, remove, revField, s4, selectGroupFromList,
    selectUserFromList, setGroups, setUsers, update, updateGroup,
    updateUser, users, window, writeGroupTable, writeGroupsTable,
    writeLog, writeTable, writeUserTable, writeUsersTable
 */

var idField, revField, users, groups, getUsers, setUsers, getGroups, setGroups,
    getJSON, provisionUsers, provisionGroups, createUser, createGroup,
    readUser, getLocIndex, selectUserFromList, clearUserForm, updateUser,
    readGroup, populateMemberList, selectGroupFromList, updateGroup,
    listUsersByUid, deleteUser, populateUserList, listGroupsByName, deleteUserFromList,
    deleteGroup, populateGroupList, deleteGroupFromList,
    writeUserTable, writeUsersTable, writeGroupTable, writeGroupsTable,
    getServletURL, getGroupsURL, getGroupContainer, getUsersURL, getUserContainer,
    getDemoBase, preWrap, empty, User, Group,
    getHeaderRow, getDataRow, getTable,
    getUserName, writeLog, writeTable, prettyPrint, getGuid, s4;

idField = "_id";
revField = "_rev";

// Get groups and users from JSON files in the same directory as this page.
groups = "";
users = "";
getGroups = function () {
    "use strict";
    return groups;
};

setGroups = function () {
    "use strict";
    groups = getJSON("Groups.json");
};

getUsers = function () {
    "use strict";
    return users;
};

setUsers = function () {
    "use strict";
    users = getJSON("Users.json");
};

getJSON = function (file) {
    "use strict";
    var resource, xhr, response;

    resource = getDemoBase() + "/" + file;
    xhr = new XMLHttpRequest();
    xhr.open('GET', resource, false);
    xhr.send("");

    response = "";
    if (xhr.status === 200) { // OK
        response = xhr.responseText;
    }
    return response;
};

// Use the common REST API to create groups.
// Calling this repeatedly should cause a bunch of HTTP 409 Conflicts.
provisionGroups = function (logId) {
    "use strict";
    var collection, i, group, resource, result;

    setGroups();

    collection = JSON.parse(getGroups());
    for (i = 0; i < collection.length; i += 1) {
        group = collection[i];
        resource = getGroupContainer() + collection[i].name;
        result = create(group, resource);
        writeLog(logId, "Result for last group:\n" + prettyPrint(result));
    }
};

// Use the common REST API to create users.
// Calling this repeatedly should cause a bunch of HTTP 409 Conflicts.
provisionUsers = function (logId) {
    "use strict";
    var collection, i, user, resource, result;

    setUsers();

    collection = JSON.parse(getUsers());
    for (i = 0; i < collection.length; i += 1) {
        user = collection[i];
        resource = getUserContainer() + collection[i].uid;
        result = create(user, resource);
        writeLog(logId, "Result for last user:\n" + prettyPrint(result));
    }
};

// Create user based on a form having prefixed field names.
// Log results to the element with id = logId.
createUser = function (form, prefix, logId) {
    "use strict";
    var myUser, resource, result;

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

        resource = getUserContainer() + myUser.uid;
        result = create(myUser, resource);
        writeLog(logId, "Created user:\n" + prettyPrint(result));
    } catch (err) {
        writeLog(logId, "Create failed: " + err);
    }
};

// Create group based on a form having prefixed field names.
// Log results to the element with id = logId.
createGroup = function (form, prefix, logId) {
    "use strict";
    var members, i, myGroup, resource, result;

    members = [];
    for (i = 0; i < form[prefix + "users"].options.length; i += 1) {
        if (form[prefix + "users"].options[i].selected) {
            members.push(form[prefix + "users"].options[i].value);
        }
    }

    try {
        myGroup = new Group(
            form[prefix + "name"].value,
            form[prefix + "description"].value,
            members
        );
        resource = getGroupContainer() + myGroup.name;
        console.log(myGroup);
        result = create(myGroup, resource);
        writeLog(logId, "Created group:\n" + prettyPrint(result));
    } catch (err) {
        writeLog(logId, "Create failed: " + err);
    }
};

// Retrieve a user from the JSON Resource Servlet.
readUser = function (id) {
    "use strict";
    var resource, result;

    resource = getUserContainer() + id;
    result = read(resource);
    return JSON.parse(result);
};

// Get the index of a selected location (as it appears in a <option>s list).
getLocIndex = function (location) {
    "use strict";

    switch (location) {
    case "Cupertino":
        return 1;
    case "Paris":
        return 2;
    case "Santa Clara":
        return 3;
    case "Sunnyvale":
        return 4;
    default:
        return 0;
    }
};

// Populate a user form based on the value from a <select> list.
// The <select> id is prefix + listId.
selectUserFromList = function (form, prefix, listId) {
    "use strict";
    var list, id, user;

    list = document.getElementById(prefix + listId);
    id = list.options[list.selectedIndex].value;
    user = readUser(id);

    // Populate form for updating.
    form[prefix + "userId"].value = user[idField];
    form[prefix + "userVersion"].value = user[revField];

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
};

// Clear user form fields, where field names start with prefix.
clearUserForm = function (form, prefix) {
    "use strict";

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
};

// Update a user in JSON Resource Servlet based on the content of a form.
// Form fields start with prefix.
// Log results to element with id = logId.
updateUser = function (form, prefix, logId) {
    "use strict";
    var myUser, resource, result;

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

    resource = getUserContainer() + form[prefix + "userId"].value;
    result = update(myUser, form[prefix + "userVersion"].value, resource);
    writeLog(logId, "Updated user:\n" + prettyPrint(result));
    clearUserForm(form, prefix);
};

// Retrieve a group from JSON Resource Servlet.
readGroup = function (name) {
    "use strict";
    var resource, result;

    resource = getGroupContainer() + name;
    result = read(resource);
    return JSON.parse(result);
};

// Populate <option> elements of a <select> list with members.
populateMemberList = function (members, listId) {
    "use strict";
    var list, options, i, element, j;

    list = document.getElementById(listId);

    // Sort users by fullname, which is an array.
    options = queryObjects(getUsersURL(), [])
        .sort(function (a, b) {
            return a.fullname[0].toString().localeCompare(b.fullname[0].toString());
        });

    if (options.length > 0) { empty(list); }

    for (i = 0; i < options.length; i += 1) {
        element = document.createElement("option");
        element.textContent = options[i].fullname[0];
        element.value = options[i].uid;
        for (j = 0; j < members.length; j += 1) {
            if (element.value === members[j]) {
                element.selected = "selected";
            }
        }
        list.appendChild(element);
    }
};

// Populate a group form based on the value from a <select> list.
// The <select> id is prefix + listId.
// Members, including selected, are in element with id = prefix + memberListId.
selectGroupFromList = function (form, prefix, listId, memberListId) {
    "use strict";
    var list, id, group;

    list = document.getElementById(prefix + listId);
    id = list.options[list.selectedIndex].value;
    group = readGroup(id);

    // Populate form for updating.
    form[prefix + "groupId"].value = group[idField];
    form[prefix + "groupVersion"].value = group[revField];

    form[prefix + "name"].value = group.name;
    form[prefix + "description"].value = group.description;
    populateMemberList(group.members, prefix + memberListId);
};

// Update a group in JSON Resource Servlet based on the content of a form.
// Form fields start with prefix.
// Log results to element with id = logId.
updateGroup = function (form, prefix, logId) {
    "use strict";
    var myGroup, members, i, resource, result;

    members = [];
    for (i = 0; i < form[prefix + "members"].options.length; i += 1) {
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

    resource = getGroupContainer() + form[prefix + "groupId"].value;
    result = update(myGroup, form[prefix + "groupVersion"].value, resource);
    writeLog(logId, "Updated group:\n" + prettyPrint(result));
};

// List users by their user ID strings in sorted order.
// Log results to element with id = logId.
listUsersByUid = function (logId) {
    "use strict";
    var array, list, i;

    // Sort users by uid, which is a string
    array = queryObjects(getUsersURL(), [])
        .sort(function (a, b) {
            return a.uid.toString().localeCompare(b.uid.toString());
        });
    list = "";
    for (i = 0; i < array.length; i += 1) {
        list = list + array[i].uid + "\n";
    }
    writeLog(logId, "User IDs:\n" + list);
};

// Delete a user taking the user ID from a form.
// Form fields start with prefix.
// Log results to element with id = logId.
deleteUser = function (form, prefix, logId) {
    "use strict";
    var resource, result;

    resource = getUserContainer() + form[prefix + "uid"].value;
    result = remove(resource);
    writeLog(logId, "Deleted user:\n" + prettyPrint(result));
};

// Populate a <select> element with user name <option> elements.
populateUserList = function (listId) {
    "use strict";
    var list, options, i, element;

    list = document.getElementById(listId);

    // Sort users by fullname, which is an array.
    options = queryObjects(getUsersURL(), [])
        .sort(function (a, b) {
            return a.fullname[0].toString().localeCompare(b.fullname[0].toString());
        });

    if (options.length > 0) { empty(list); }

    for (i = 0; i < options.length; i += 1) {
        element = document.createElement("option");
        element.textContent = options[i].fullname[0];
        element.value = options[i].uid;
        list.appendChild(element);
    }
};

// List groups by their names in sorted order.
// Log results to element with id = logId.
listGroupsByName = function (logId) {
    "use strict";
    var array, list, i;

    // Sort groups by name, which is a string
    array = queryObjects(getGroupsURL(), [])
        .sort(function (a, b) {
            return a.name.toString().localeCompare(b.name.toString());
        });
    list = "";
    for (i = 0; i < array.length; i += 1) {
        list = list + array[i].name + "\n";
    }
    writeLog(logId, "Group names:\n" + list);
};

// Delete a user taking the user ID from a <select> list.
// Log results to element with id = logId.
deleteUserFromList = function (listId, logId) {
    "use strict";
    var list, id, resource, result;

    list = document.getElementById(listId);
    id = list.options[list.selectedIndex].value;
    resource = getUserContainer() + id;
    result = remove(resource);
    writeLog(logId, "Deleted user:\n" + prettyPrint(result));
};

// Delete a group taking the name from a form.
// Form fields start with prefix.
// Log results to element with id = logId.
deleteGroup = function (form, prefix, logId) {
    "use strict";
    var resource, result;

    resource = getGroupContainer() + form[prefix + "name"].value;
    result = remove(resource);
    writeLog(logId, "Deleted group:\n" + prettyPrint(result));
};

// Populate a <select> element with group name <option> elements.
populateGroupList = function (listId) {
    "use strict";
    var list, options, i, element;

    list = document.getElementById(listId);

    // Sort groups by name, which is a string
    options = queryObjects(getGroupsURL(), [])
        .sort(function (a, b) {
            return a.name.toString().localeCompare(b.name.toString());
        });

    if (options.length > 0) { empty(list); }

    for (i = 0; i < options.length; i += 1) {
        element = document.createElement("option");
        element.textContent = options[i].name;
        element.value = options[i].name;
        list.appendChild(element);
    }
};

// Delete a group taking the name from a <select> list.
// Log results to element with id = logId.
deleteGroupFromList = function (listId, logId) {
    "use strict";
    var list, id, resource, result;

    list = document.getElementById(listId);
    id = list.options[list.selectedIndex].value;
    resource = getGroupContainer() + id;
    result = remove(resource);
    writeLog(logId, "Deleted group:\n" + prettyPrint(result));
};

// Return a table of one user, based on fields selected on form.
// Form fields start with prefix.
// Display results to element with id = tableId.
writeUserTable = function (form, prefix, listId, tableId) {
    "use strict";
    var list, id, fields, resource, user;

    list = document.getElementById(prefix + listId);
    id = list.options[list.selectedIndex].value;

    fields = [];
    if (form[prefix + "mail"].checked) { fields.push("mail"); }
    if (form[prefix + "fullname"].checked) { fields.push("fullname"); }
    if (form[prefix + "phone"].checked) { fields.push("phone"); }
    if (form[prefix + "all"].checked) { fields = []; }  // Get everything

    resource = getUserContainer() + id;
    user = JSON.parse(read(resource, fields));
    writeTable(tableId, [user]);
};

// Return a table of all users, based on fields selected on form.
// Form fields start with prefix.
// Display results to element with id = tableId.
writeUsersTable = function (form, prefix, tableId) {
    "use strict";
    var fields;

    fields = [];
    if (form[prefix + "mail"].checked) { fields.push("mail"); }
    if (form[prefix + "fullname"].checked) { fields.push("fullname"); }
    if (form[prefix + "phone"].checked) { fields.push("phone"); }
    if (form[prefix + "all"].checked) { fields = []; }  // Get everything

    writeTable(tableId, queryObjects(getUsersURL(), fields)
        .sort(function (a, b) {
            return a.fullname[0].toString().localeCompare(b.fullname[0].toString());
        }));
};

// Return a table of one group.
// Form fields start with prefix.
// Display results to element with id = tableId.
writeGroupTable = function (prefix, listId, tableId) {
    "use strict";
    var list, id, fields, resource, group, names, i;

    list = document.getElementById(prefix + listId);
    id = list.options[list.selectedIndex].value;

    fields = ["name", "members", "description"];
    resource = getGroupContainer() + id;
    group = JSON.parse(read(resource, fields));

    // Display user names instead of user IDs.
    names = "";
    if (group.members.length > 0) {
        names = getUserName(group.members[0]);
        for (i = 1; i < group.members.length; i += 1) {
            names = names + "<br />" + getUserName(group.members[i]);
        }
    }
    group.members = names;
    writeTable(tableId, [group]);
};

// Return a table of all groups, based on fields selected on form.
// Form fields start with prefix.
// Display results to element with id = tableId.
writeGroupsTable = function (form, prefix, tableId) {
    "use strict";
    var fields, groups, i, names, j;

    fields = [];
    if (form[prefix + "name"].checked) { fields.push("name"); }
    if (form[prefix + "members"].checked) { fields.push("members"); }
    if (form[prefix + "description"].checked) { fields.push("description"); }

    groups = queryObjects(getGroupsURL(), fields);

    // Display user names instead of user IDs.
    for (i = 0; i < groups.length; i += 1) {
        names = "";
        if (groups[i].members.length > 0) {
            names = getUserName(groups[i].members[0]);
            for (j = 1; j < groups[i].members.length; j += 1) {
                names = names + "<br />" + getUserName(groups[i].members[j]);
            }
        }
        groups[i].members = names;
    }

    writeTable(tableId, groups.sort(function (a, b) {
        return a.name.toString().localeCompare(b.name.toString());
    }));
};

// JSON Resource Servlet deployed under /json, at http://host:port/json.
getServletURL = function () {
    "use strict";
    var protocol, hostname, port;

    protocol = window.location.protocol;
    hostname = window.location.hostname;
    port = window.location.port;
    return protocol + "//" + hostname + ":" + port + "/json";
};

// Return the URL to the /groups endpoint, such as http://host:port/json/groups.
getGroupsURL = function () {
    "use strict";

    return getServletURL() + "/groups";
};

// Return the group container, such as http://host:port/json/groups/.
getGroupContainer = function () {
    "use strict";

    return getGroupsURL() + "/";
};

// Return the URL to the /users endpoint, such as http://host:port/json/users.
getUsersURL = function () {
    "use strict";

    return getServletURL() + "/users";
};

// Return the user container, such as http://host:port/json/users/.
getUserContainer = function () {
    "use strict";

    return getUsersURL() + "/";
};

// Return base URL of demo.
getDemoBase = function () {
    "use strict";

    return window.location.href.substring(0, window.location.href.lastIndexOf('/'));
};

// Prepare string for logging into HTML page.
preWrap = function (string) {
    "use strict";

    return "<pre>" + string + "</pre>";
};

// Empty DOM node of all children.
empty = function (node) {
    "use strict";

    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
};

// Create a user object.
User = function (mail, first, last, pwd, tel, fax, room, loc, home, uid, gid) {
    "use strict";
    // { "uid": string, "mail": string, "firstname": string, "lastname": string,
    //   "fullname": array, "userpassword": string,
    //   "phone": string, "fax": string, "room": int, "location": string,
    //   "homeDirectory": string, "uidNumber": int, "gidNumber": int };

    var userId;

    if (!mail || mail  === "") {
        throw "User mail address is required.";
    }
    userId = mail.substring(0, mail.lastIndexOf('@'));
    this.uid = userId;
    this.mail = mail;

    if (!first || first === "") {
        throw "User first name is required.";
    }
    this.firstname = first;

    if (!last || last === "") {
        throw "User last name is required.";
    }
    this.lastname = last;
    this.fullname = [first + " " + last];

    if (!pwd) {
        this.userpassword = "";
    } else {
        this.userpassword = pwd;
    }

    if (!tel) {
        this.phone = "";
    } else {
        this.phone = tel;
    }
    if (!fax) {
        this.fax = "";
    } else {
        this.fax = fax;
    }

    if (!room) {
        this.room = -1;
    } else {
        this.room = parseInt("10", room);
    }

    if (!loc || loc === 'Select Location') {
        this.location = "Paris";
    } else {
        this.location = loc;
    }

    if (!home) {
        this.homeDirectory = "";
    } else {
        this.homeDirectory = home;
    }
    if (!uid) {
        this.uidNumber = -1;
    } else {
        this.uidNumber = parseInt("10", uid);
    }
    if (!gid) {
        this.gidNumber = -1;
    } else {
        this.gidNumber = parseInt("10", gid);
    }
};

// Create a group object.
Group = function (name, description, members) {
    "use strict";
    // { "name": string, "description": string, "members": array };

    var i;

    if (!name || name === "") {
        throw "Group name is required.";
    }
    this.name = name;

    if (!description) {
        this.description = "";
    } else {
        this.description = description;
    }

    this.members = [];
    if (members) {
        for (i = 0; i < members.length; i += 1) {
            this.members.push(members[i]);
        }
    }
};

// Capitalize first letter.
String.prototype.capitalize = function () {
    "use strict";

    return this.charAt(0).toUpperCase() + this.slice(1);
};

// Return a <tr> with <th> for each field of an object.
getHeaderRow = function (object) {
    "use strict";
    var cells, prop;

    cells = "";
    for (prop in object) {
        if (object.hasOwnProperty(prop)) {
            cells = cells + "<th>" + prop.capitalize() + "</th>";
        }
    }
    return "<tr>" + cells + "</tr>";
};

// Return a <tr> with <td> for each field of an object.
getDataRow = function (object) {
    "use strict";
    var cells, prop;

    cells = "";
    for (prop in object) {
        if (object.hasOwnProperty(prop)) {
            cells = cells + "<td>" + object[prop] + "</td>";
        }
    }
    return "<tr>" + cells + "</tr>";
};

// Build and return a table of objects such as users or groups.
getTable = function (objects) {
    "use strict";
    var rows, i;

    if (objects.length === 0) { return ""; }

    rows = getHeaderRow(objects[0]);
    for (i = 0; i < objects.length; i += 1) {
        rows = rows + getDataRow(objects[i]);
    }
    return "<table>" + rows + "</table>";
};

// Return a user's full name given the user's ID.
getUserName = function (id) {
    "use strict";

    return JSON.parse(read(getUserContainer() + id, ["fullname"])).fullname;
};

// Write a log message into a <div id="logId"></div>.
writeLog = function (logId, message) {
    "use strict";

    document.getElementById(logId).innerHTML = preWrap(message);
};

// Write a table into a <div id="tableId"></div>.
writeTable = function (tableId, array) {
    "use strict";

    document.getElementById(tableId).innerHTML = getTable(array);
};

prettyPrint = function (jsonString) {
    "use strict";

    return JSON.stringify(JSON.parse(jsonString), undefined, 4);
};

// http://note19.com/2007/05/27/javascript-guid-generator/
// var myFakeId = getGuid();
s4 = function () {
    "use strict";

    return Math.floor(
        Math.random() * 0x10000 /* 65536 */
    ).toString(16);
};

getGuid = function () {
    "use strict";

    return (
        s4() + s4() + "-" +
        s4() + "-" +
        s4() + "-" +
        s4() + "-" +
        s4() + s4() + s4()
    );
};
