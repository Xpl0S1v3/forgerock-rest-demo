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

/*global angular */

angular.module('main', ['ngResource', 'ngRoute', 'ui.bootstrap'])
    .config(function ($routeProvider) {
        "use strict";

        $routeProvider
            .when('/', {
                templateUrl: 'partials/about.html'
            })
            .when('/create', {
                templateUrl: 'partials/create.html'
            })
            .when('/read', {
                templateUrl: 'partials/read.html'
            })
            .when('/update', {
                templateUrl: 'partials/update.html'
            })
            .when('/delete', {
                templateUrl: 'partials/delete.html'
            })
            .when('/patch', {
                templateUrl: 'partials/patch.html'
            })
            .when('/action', {
                templateUrl: 'partials/action.html'
            })
            .when('/query', {
                templateUrl: 'partials/query.html'
            });
    });
