package com.dev.api.util;

import java.text.MessageFormat;

public class ApiUtils {

	public static String getDefaultString(String str, String def) {
		return isEmpty(str) ? (isEmpty(def) ? "" : def) : str;
	}
	public static String getDefaultString(String str) {
		return getDefaultString(str, "");
	}
	
	public static boolean isEmpty(String str) {
		return str == null || str.trim().isEmpty();
	}
	
	public static String formatStr(String str, Object ... arguments) {
		return MessageFormat.format(str, arguments);
	}
}
