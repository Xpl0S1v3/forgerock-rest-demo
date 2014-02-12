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
 * User object corresponding to a user JSON resource.
 */
public class User implements JsonResource {
    private String uid;
    private String userpassword;
    private String fax;
    private String firstname;
    private String[] fullname;
    private String phone;
    private String lastname;
    private int room;
    private String homeDirectory;
    private String mail;
    private String location;
    private int uidNumber;
    private int gidNumber;

    /**
     * Construct a user object corresponding to a user JSON resource.
     *
     * @param uid           User ID
     * @param userpassword  User password
     * @param fax           Fax number
     * @param firstname     Given name
     * @param fullname      Full (formatted) name
     * @param phone         Phone number
     * @param lastname      Surname
     * @param room          Room number
     * @param homeDirectory Home directory on a UNIX/Linux file system
     * @param mail          Email address
     * @param location      Office location
     * @param uidNumber     UNIX/Linux UID number
     * @param gidNumber     UNIX/Linux GID number
     */
    public User(String uid, String userpassword, String fax, String firstname,
                String[] fullname, String phone, String lastname, int room,
                String homeDirectory, String mail, String location,
                int uidNumber, int gidNumber) {

        this.uid = uid;
        this.userpassword = userpassword;
        this.fax = fax;
        this.firstname = firstname;
        this.fullname = fullname;
        this.phone = phone;
        this.lastname = lastname;
        this.room = room;
        this.homeDirectory = homeDirectory;
        this.mail = mail;
        this.location = location;
        this.uidNumber = uidNumber;
        this.gidNumber = gidNumber;
    }

    /**
     * Get an ID for this user.
     * @return ID for this user
     */
    public String getId() {
        return this.uid;
    }
}
