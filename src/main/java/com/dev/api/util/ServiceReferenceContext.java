package com.dev.api.util;

import org.springframework.http.HttpHeaders;

import com.dev.api.schema.user.UserSession;

public class ServiceReferenceContext {
	static final ThreadLocal<UserSession> currentSession = new ThreadLocal<>();
	static final ThreadLocal<HttpHeaders> apiRequestHeaders = new ThreadLocal<>();
	
	public static void setUserSession(UserSession session) {
		currentSession.set(session);
	}
	
	public static UserSession getUserSession() {
		return currentSession.get();
	}

	public static HttpHeaders getApiHeaders() {
		return apiRequestHeaders.get();
	}
	
	public static void setApiHeaders(HttpHeaders headers) {
		apiRequestHeaders.set(headers);
	}
}
