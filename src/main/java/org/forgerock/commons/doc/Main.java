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

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;

/**
 * Command-line client for adding users, groups to JSON Resource Servlet.
 */
public final class Main {

    /**
     * Load users and groups into JSON Resource Servlet at the default location.
     *
     * @param args The command line arguments: Users.json file, Groups.json file
     */
    public static void main(final String[] args) {
        if (args.length != 2) {
            System.err.println("Usage: users-json groups-json");
            System.err.println("For example: /tmp/Users.json /tmp/Groups.json");
            System.exit(1);
        }
        final File users = new File(args[0]);
        final File groups = new File(args[1]);

        try {
            Provisioner provisioner = new Provisioner(users, groups);
            provisioner.addUsers();
            provisioner.addGroups();
        } catch (MalformedURLException e) {
            e.printStackTrace();
            System.exit(2);
        } catch (IOException e) {
            System.err.println(e.getMessage());
            System.err.println(e.getCause());
            e.printStackTrace(System.err);
            System.exit(2);
        }
    }

    /**
     * Constructor not used.
     */
    private Main() {
        // Nothing to do
    }
}
