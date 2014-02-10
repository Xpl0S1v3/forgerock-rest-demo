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

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Basic HTTP client for the JSON Resource Servlet.
 */
public class HttpClient {
    private URL servletUrl;

    /**
     * Construct a client of a JSON Resource Servlet.
     *
     * @param servletUrl Base URL for the JSON Resource Servlet.
     * @throws MalformedURLException provided URL is malformed
     */
    public HttpClient(final URL servletUrl) throws MalformedURLException {
        this.servletUrl = servletUrl;
    }

    /**
     * Create a resource with a known resource ID using HTTP PUT.
     *
     * @param uri          URI to the resource, such as /users/bjensen
     * @param jsonResource JSON representation of the resource
     * @throws IOException Something went wrong creating the resource
     */
    public void create(final String uri, final byte[] jsonResource)
            throws IOException {
        final URL resourceUrl = new URL(servletUrl, uri);

        Map<String, List<String>> headers = new HashMap<String, List<String>>();

        ArrayList<String> accepts = new ArrayList<String>();
        accepts.add("application/json");
        headers.put("Accept", accepts);

        ArrayList<String> lengths = new ArrayList<String>();
        lengths.add(Integer.toString(jsonResource.length));
        headers.put("Content-Length", lengths);

        ArrayList<String> types = new ArrayList<String>();
        types.add("application/json");
        headers.put("Content-Type", types);

        ArrayList<String> matches = new ArrayList<String>();
        matches.add("*");
        headers.put("If-None-Match", matches);

        HttpURLConnection connection = (HttpURLConnection) resourceUrl.openConnection();
        connection.setRequestMethod("PUT");
        connection.setFixedLengthStreamingMode(jsonResource.length);
        connection.setDoOutput(true);

        InputStream in;
        OutputStream out;
        int httpStatus;

        try {
            out = connection.getOutputStream();
        } catch (IOException e) {
            throw new IOException("Failed to create " + uri, e.getCause());
        }

        try {
            out.write(jsonResource);
            httpStatus = connection.getResponseCode();
        } catch (IOException e) {
            throw new IOException("Failed to create " + uri, e.getCause());
        }

        if (httpStatus != 201) {
            connection.disconnect();
            throw new IOException("Failed to create " + uri
                    + ", HTTP Status: " + httpStatus);
        }

        try {
            in = connection.getInputStream();
            System.out.println("Response creating " + uri + ":");
            System.out.println(Utils.streamToString(in));
        } catch (IOException e) {
            throw new IOException("Failed to read output", e.getCause());
        } finally {
            connection.disconnect();
        }
    }
/*
    public void read() {}
    public void update() {}
    public void delete() {}
    public void patch() {}
    public void action() {}
    public void query() {}
*/
}
