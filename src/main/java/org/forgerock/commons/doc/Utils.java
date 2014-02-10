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

import java.io.InputStream;
import java.util.Scanner;

/**
 * Some utility methods.
 */
public final class Utils {
    /**
     * Constructor not used.
     */
    private Utils() {
        // Nothing to do
    }

    /**
     * Convert an {@code InputStream} to a {@code String}.
     *
     * @param is The stream to convert
     * @return the {@code String} containing content from the {@code InputStream}
     */
    public static String streamToString(InputStream is) {
        Scanner scanner = new Scanner(is).useDelimiter("\\A");
        return scanner.hasNext() ? scanner.next() : "";
    }

    /**
     * Encode unsafe characters in a URI component string.
     *
     * @param uriComponent The raw string to encode
     * @return the URI-safe {@code String}
     */
    public static String encodeUriComponent(final String uriComponent) {
        StringBuilder sb = new StringBuilder();

        for (char ch : uriComponent.toCharArray()) {
            if (isUnsafe(ch)) {
                sb.append('%').append(toHex(ch / 16)).append(toHex(ch % 16));
            } else {
                sb.append(ch);
            }
        }

        return sb.toString();
    }

    private static boolean isUnsafe(final char ch) {
        if (ch > 128 || ch < 0) {
            return true;
        }
        return (" %$&+,/:;=?@<>#%".indexOf(ch) >= 0);
    }

    private static char toHex(final int ch) {
        return (char) (ch < 10 ? '0' + ch : 'A' + ch - 10);
    }
}
