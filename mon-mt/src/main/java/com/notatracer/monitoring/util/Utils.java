package com.notatracer.monitoring.util;

import java.util.Optional;

public class Utils {

	private static char DEFAULT_STRING_DELIMITER = ';';
	
	public static String[] getStringList(String delimited, Optional<Character> delimiter) {
		char d = delimiter.isPresent() ? delimiter.get() : DEFAULT_STRING_DELIMITER;
		return delimited.split(String.valueOf(d));
	}
}
