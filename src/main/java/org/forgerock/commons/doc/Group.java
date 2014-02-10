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

/**
 * Group object corresponding to a group JSON resource.
 */
public class Group {
    private String name;
    private String description;
    private String[] members;

    /**
     * Construct a group object corresponding to a group JSON resource.
     *
     * @param name           Group name
     * @param description  Description of the group
     * @param members      Members of the group
     */
    public Group(String name, String description, String[] members) {

        this.name = name;
        this.description = description;
        this.members = members;
    }

    /**
     * Get an ID for this group.
     * @return an ID for this group
     */
    public String getId() {
        return this.name;
    }
}
