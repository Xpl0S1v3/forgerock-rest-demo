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

package org.forgerock.commons.doc;

import com.google.gson.Gson;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Client for adding users, groups to JSON Resource Servlet.
 */
public class Provisioner {
    private File users;
    private File groups;
    private URL servletUrl;
    private HttpClient httpClient;

    /**
     * Construct a provisioner to add users, groups to a JSON Resource Servlet
     * at the default location, {@code http://localhost:8080/json/}.
     *
     * @param users  File containing a JSON array of users
     * @param groups File containing a JSON array of groups
     * @throws MalformedURLException default URL is malformed
     */
    public Provisioner(final File users, final File groups)
            throws MalformedURLException {
        this(users, groups, new URL("http://localhost:8080/json/"));
    }

    /**
     * Construct a provisioner to add users, groups to a JSON Resource Servlet.
     *
     * @param users      File containing a JSON array of users
     * @param groups     File containing a JSON array of groups
     * @param servletUrl URL to JSON Resource Servlet
     * @throws MalformedURLException provided URL is malformed
     */
    public Provisioner(final File users, final File groups, final URL servletUrl)
            throws MalformedURLException {
        this.users = users;
        this.groups = groups;
        this.servletUrl = servletUrl;
        this.httpClient = new HttpClient(servletUrl);
    }

    /**
     * Add users to the JSON Resource Servlet.
     * @throws IOException if provisioning fails
     */
    public void addUsers() throws IOException {
        Gson gson = new Gson();

        try {
            User[] theUsers = gson.fromJson(new FileReader(users), User[].class);
            for (User user : theUsers) {
                createUser(user);
            }
        } catch (FileNotFoundException e) {
            throw new IOException(users.getPath() + " not found", e.getCause());
        } catch (IOException e) {
            throw e;
        }
    }

    /**
     * Add groups to the JSON Resource Servlet.
     * @throws IOException if provisioning fails
     */
    public void addGroups() throws IOException {
        Gson gson = new Gson();

        try {
            Group[] theGroups = gson.fromJson(new FileReader(groups), Group[].class);
            for (Group group : theGroups) {
                createGroup(group);
            }
        } catch (FileNotFoundException e) {
            throw new IOException(users.getPath() + " not found", e.getCause());
        } catch (IOException e) {
            throw e;
        }
    }

    private void createUser(User user) throws IOException {
        Gson gson = new Gson();
        final byte[] resource = gson.toJson(user).getBytes();
        final String id = Utils.encodeUriComponent(user.getId());
        createResource(servletUrl + "users/" + id, resource);
    }

    private void createGroup(Group group) throws IOException {
        Gson gson = new Gson();
        final byte[] resource = gson.toJson(group).getBytes();
        final String id = Utils.encodeUriComponent(group.getId());
        createResource(servletUrl + "groups/" + id, resource);
    }

    private void createResource(final String uri, final byte[] resource) throws IOException {
        httpClient.create(uri, resource);
    }
}
