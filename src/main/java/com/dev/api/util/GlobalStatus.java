package com.dev.api.util;

public class GlobalStatus {
	public static boolean isPermission(int rights) {
		return "1000".indexOf(rights) > -1 ? true : false;
	}
}
