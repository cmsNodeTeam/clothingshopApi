package com.dev.api.util;

import com.dev.api.schema.user.UserSession;

public class GlobalStatus {
	public static boolean isPermission(int rights) {
		return isPermission(String.valueOf(rights));
	}
	
	public static boolean isPermission(String rights) {
		if(getUserSession().isSupervisor()) {
			return true;
		}
		return getUserSession().getRights().indexOf(rights) > -1 ? true : false;
	}
	
	public static UserSession getUserSession() {
		return ServiceReferenceContext.getUserSession();
	}
}
