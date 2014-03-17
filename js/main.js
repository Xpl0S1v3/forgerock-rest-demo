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
 * Copyright 2014 ForgeRock AS
 */

/*global angular, window, rsUrl */

/**
 * The URL to the JSON Resource Servlet.
 * @type {string} The URL to the JSON Resource Servlet.
 */
var rsUrl;
rsUrl = window.location.protocol + "//" + window.location.hostname + ":" +
    window.location.port + "/json/";

angular.module('main', ['ngResource', 'ngRoute', 'ui.bootstrap'])
    .factory('crestResource', function ($resource) {
        "use strict";
        var CrestResource;

        CrestResource = $resource("");

        CrestResource.prototype.getAll = function (url, successCb, errorCb) {
            CrestResource = $resource(url);
            return CrestResource.get({"_queryFilter": true}, successCb, errorCb);
        };

        CrestResource.prototype.put = function (url, successCb, errorCb, resource) {
            CrestResource = $resource(url, null, {
                "put": {
                    method: "PUT",
                    headers: {
                        "Accept" : "application/json",
                        "Content-Type" : "application/json",
                        "If-None-Match" : "*"
                    }
                }
            });
            return CrestResource.put({}, resource, successCb, errorCb);
        };

        CrestResource.prototype.read = function (url, successCb, errorCb) {
            CrestResource = $resource(url);
            return CrestResource.get({}, successCb, errorCb);
        };

        CrestResource.prototype.update = function (url, successCb, errorCb, resource, version) {
            CrestResource = $resource(url, null, {
                "put": {
                    method: "PUT",
                    headers: {
                        "Accept" : "application/json",
                        "Content-Type" : "application/json",
                        "If-Match" : version
                    }
                }
            });
            return CrestResource.update({}, resource, successCb, errorCb);
        };

        CrestResource.prototype.del = function (url, successCb, errorCb) {
            CrestResource = $resource(url);
            return CrestResource.remove({}, successCb, errorCb);
        };

        CrestResource.prototype.post = function (url, successCb, errorCb, resource) {
            CrestResource = $resource(url, {"_action": "create"}, {
                "post": {
                    method: "POST",
                    headers: {
                        "Accept" : "application/json",
                        "Content-Type" : "application/json"
                    }
                }
            });
            return CrestResource.post({}, resource, successCb, errorCb);
        };

        return new CrestResource();
    })
    .config(function ($routeProvider) {
        "use strict";

        $routeProvider
            .when('/', {
                templateUrl: 'partials/about.html'
            })
            .when('/create', {
                templateUrl: 'partials/create.html',
                controller: function ($scope, $q, crestResource, users) {
                    $scope.user = {};
                    $scope.userCreated = false;
                    $scope.userCreateFailed = false;
                    $scope.createUser = function () {
                        var url, deferred, successCb, failureCb;

                        $scope.user.uid = $scope.user.mail.substring(
                            0,
                            $scope.user.mail.indexOf('@')
                        );
                        $scope.user.fullname =
                            [ $scope.user.cn + " " + $scope.user.sn ];

                        $scope.user.phone = $scope.user.phone || "+1-415-555-1212";
                        $scope.user.location = "San Francisco";
                        $scope.user.room = 1234;

                        url = rsUrl + "users/" + $scope.user.uid;

                        deferred = $q.defer();

                        if ($scope.user.userPassword !== $scope.user.confirmPassword) {
                            $scope.userCreateFailed = "Passwords do not match.";
                            return deferred.promise;
                        }

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("Create failed");
                            } else {
                                $scope.user = result;
                                $scope.userCreated = true;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            $scope.userCreateFailed = "Failed to create user";
                            deferred.reject("Create failed");
                        };

                        crestResource.put(url, successCb, failureCb, $scope.user);

                        return deferred.promise;
                    };

                    $scope.users = users;
                    $scope.groupCreated = false;
                    $scope.groupCreateFailed = false;
                    $scope.createGroup = function () {
                        var url, deferred, successCb, failureCb;

                        url = rsUrl + "groups/" + $scope.group.name;

                        $scope.group.members = [];
                        angular.forEach($scope.members, function (member) {
                            this.push(member.uid);
                        }, $scope.group.members);

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("Create failed");
                            } else {
                                $scope.group = result;
                                $scope.groupCreated = true;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            $scope.groupCreateFailed = "Failed to create group";
                            deferred.reject("Create failed");
                        };

                        crestResource.put(url, successCb, failureCb, $scope.group);

                        return deferred.promise;
                    };
                },
                resolve: {
                    users: function ($q, crestResource) {
                        var url, deferred, successCb, options, failureCb;

                        url = rsUrl + "users";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No users found");
                            } else {
                                options = result.result.sort(function (a, b) {
                                    return a.fullname[0].toString()
                                        .localeCompare(b.fullname[0].toString());
                                });
                                deferred.resolve(options);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No users found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    }
                }
            })
            .when('/read', {
                templateUrl: 'partials/read.html',
                controller: function ($scope, $q, crestResource, users, groups) {
                    $scope.users = users;
                    $scope.readUser = function () {
                        var url, deferred, successCb, failureCb;

                        url = rsUrl + "users/" + $scope.userId;

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                $scope.user = {};
                                $scope.userNotFound =
                                    "User " + $scope.userId + " not found";
                                deferred.reject("Read failed");
                            } else {
                                $scope.user = result;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            $scope.user = {};
                            $scope.userNotFound =
                                "User " + $scope.userId + " not found";
                            deferred.reject("Read failed");
                        };

                        crestResource.read(url, successCb, failureCb);

                        return deferred.promise;
                    };
                    $scope.groups = groups;
                    $scope.readGroup = function () {
                        var url, deferred, successCb, failureCb;

                        url = rsUrl + "groups/" + $scope.groupId;

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                $scope.group = {};
                                $scope.groupNotFound =
                                    "Group " + $scope.groupId + " not found";
                                deferred.reject("Read failed");
                            } else {
                                $scope.group = result;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            $scope.group = {};
                            $scope.groupNotFound =
                                "Group " + $scope.groupId + " not found";
                            deferred.reject("Read failed");
                        };

                        crestResource.read(url, successCb, failureCb);

                        return deferred.promise;
                    };
                },
                resolve: {
                    users: function ($q, crestResource) {
                        var url, deferred, successCb, options, failureCb;

                        url = rsUrl + "users";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No users found");
                            } else {
                                options = result.result.sort(function (a, b) {
                                    return a.fullname[0].toString()
                                        .localeCompare(b.fullname[0].toString());
                                });
                                deferred.resolve(options);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No users found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    },
                    groups: function ($q, crestResource) {
                        var url, deferred, successCb, options, failureCb;

                        url = rsUrl + "groups";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No groups found");
                            } else {
                                options = result.result.sort(function (a, b) {
                                    return a.name.toString()
                                        .localeCompare(b.name.toString());
                                });
                                deferred.resolve(options);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No groups found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    }
                }
            })
            .when('/update', {
                templateUrl: 'partials/update.html'
            })
            .when('/delete', {
                templateUrl: 'partials/delete.html',
                controller: function ($scope, $q, crestResource, users, groups) {
                    $scope.users = users;
                    $scope.groups = groups;
                    $scope.deleteUser = function () {
                        /*jslint nomen: true */
                        // Avoid JSLint errors when using _id, specified by CREST.
                        var url, deferred, successCb, failureCb;

                        url = rsUrl + "users/" + $scope.user._id;

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("Delete failed");
                            } else {
                                $scope.users = $scope.users.filter(
                                    function (user) {
                                        return user._id !== result._id;
                                    }
                                );
                                $scope.deletedUser = result;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("Delete failed");
                        };

                        crestResource.del(url, successCb, failureCb);

                        return deferred.promise;
                    };
                    $scope.deleteGroup = function () {
                        /*jslint nomen: true */
                        // Avoid JSLint errors when using _id, specified by CREST.
                        var url, deferred, successCb, failureCb;

                        url = rsUrl + "groups/" + $scope.group._id;

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("Delete failed");
                            } else {
                                $scope.groups = $scope.groups.filter(
                                    function (group) {
                                        return group._id !== result._id;
                                    }
                                );
                                $scope.deletedGroup = result;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("Delete failed");
                        };

                        crestResource.del(url, successCb, failureCb);

                        return deferred.promise;
                    };
                },
                resolve: {
                    users: function ($q, crestResource) {
                        var url, deferred, successCb, options, failureCb;

                        url = rsUrl + "users";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No users found");
                            } else {
                                options = result.result.sort(function (a, b) {
                                    return a.fullname[0].toString()
                                        .localeCompare(b.fullname[0].toString());
                                });
                                deferred.resolve(options);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No users found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    },
                    groups: function ($q, crestResource) {
                        var url, deferred, successCb, options, failureCb;

                        url = rsUrl + "groups";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No groups found");
                            } else {
                                options = result.result.sort(function (a, b) {
                                    return a.name.toString()
                                        .localeCompare(b.name.toString());
                                });
                                deferred.resolve(options);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No groups found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    }
                }
            })
            .when('/patch', {
                templateUrl: 'partials/patch.html'
            })
            .when('/action', {
                templateUrl: 'partials/action.html',
                controller: function ($scope, $q, crestResource, users) {
                    $scope.user = {};
                    $scope.userCreated = false;
                    $scope.userCreateFailed = false;
                    $scope.createUser = function () {
                        var deferred, successCb, failureCb;

                        $scope.user.uid = $scope.user.mail.substring(
                            0,
                            $scope.user.mail.indexOf('@')
                        );
                        $scope.user.fullname =
                            [ $scope.user.cn + " " + $scope.user.sn ];

                        $scope.user.phone = $scope.user.phone || "+1-415-555-1212";
                        $scope.user.location = "San Francisco";
                        $scope.user.room = 1234;

                        deferred = $q.defer();

                        if ($scope.user.userPassword !== $scope.user.confirmPassword) {
                            $scope.userCreateFailed = "Passwords do not match.";
                            return deferred.promise;
                        }

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("Create failed");
                            } else {
                                $scope.user = result;
                                $scope.userCreated = true;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            $scope.userCreateFailed = "Failed to create user";
                            deferred.reject("Create failed");
                        };

                        crestResource.post(rsUrl + "users", successCb, failureCb, $scope.user);

                        return deferred.promise;
                    };

                    $scope.users = users;
                    $scope.groupCreated = false;
                    $scope.groupCreateFailed = false;
                    $scope.createGroup = function () {
                        var deferred, successCb, failureCb;

                        $scope.group.members = [];
                        angular.forEach($scope.members, function (member) {
                            this.push(member.uid);
                        }, $scope.group.members);

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("Create failed");
                            } else {
                                $scope.group = result;
                                $scope.groupCreated = true;
                                deferred.resolve(result);
                            }
                        };

                        failureCb = function () {
                            $scope.groupCreateFailed = "Failed to create group";
                            deferred.reject("Create failed");
                        };

                        crestResource.post(rsUrl + "groups", successCb, failureCb, $scope.group);

                        return deferred.promise;
                    };
                },
                resolve: {
                    users: function ($q, crestResource) {
                        var url, deferred, successCb, options, failureCb;

                        url = rsUrl + "users";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No users found");
                            } else {
                                options = result.result.sort(function (a, b) {
                                    return a.fullname[0].toString()
                                        .localeCompare(b.fullname[0].toString());
                                });
                                deferred.resolve(options);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No users found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    }
                }
            })
            .when('/query', {
                templateUrl: 'partials/query.html',
                controller: function ($scope, users, groups) {
                    $scope.users = users;
                    $scope.userName = true;
                    $scope.userMail = true;
                    $scope.showUsers = false;

                    $scope.groups = groups;
                    $scope.groupName = true;
                    $scope.groupDescription = true;
                    $scope.showGroups = false;
                },
                resolve: {
                    users: function ($q, crestResource) {
                        var url, deferred, successCb, theUsers, failureCb;

                        url = rsUrl + "users";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No users found");
                            } else {
                                theUsers = result.result.sort(function (a, b) {
                                    return a.fullname[0].toString()
                                        .localeCompare(b.fullname[0].toString());
                                });
                                deferred.resolve(theUsers);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No users found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    },
                    groups: function ($q, crestResource) {
                        var url, deferred, successCb, theGroups, failureCb;

                        url = rsUrl + "groups";

                        deferred = $q.defer();

                        successCb = function (result) {
                            if (angular.equals(result, {})) {
                                deferred.reject("No groups found");
                            } else {
                                theGroups = result.result.sort(function (a, b) {
                                    return a.name.toString()
                                        .localeCompare(b.name.toString());
                                });
                                deferred.resolve(theGroups);
                            }
                        };

                        failureCb = function () {
                            deferred.reject("No groups found");
                        };

                        crestResource.getAll(url, successCb, failureCb);

                        return deferred.promise;
                    }
                }
            });
    });
