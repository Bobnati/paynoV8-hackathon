package com._paynov8.paynov8backend.user.util;

import java.time.Year;

public class AccountUtil {

    public static final String ACCOUNT_EXISTS_CODE = "201";
    public static final String ACCOUNT_EXISTS_MESSAGE = "An account already exists with this email";
    public static final String ACCOUNT_CREATION_CODE = "200";
    public static final String ACCOUNT_SUCCESS_MESSAGE = "Account created successfully";

    public static String generateAccountNumber() {
        int min = 100000;
        int max = 999999;

        Year year = Year.now();

        int randomNum = (int) Math.floor(Math.random() * (max - min + 1) + min);

        String currentYear = String.valueOf(year);
        String randomNumber = String.valueOf(randomNum);

        return currentYear + randomNumber;
    }
}
