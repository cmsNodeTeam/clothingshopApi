package com.dev.api.schema.exception;

public class RedirectException extends RuntimeException{

	private static final long serialVersionUID = 6413405860138462966L;

	private String redirectUrl;
	
	public RedirectException(String redirectUrl, String message) {
		super(message);
		this.redirectUrl = redirectUrl;
	}

	public String getRedirectUrl() {
		return redirectUrl;
	}

	public void setRedirectUrl(String redirectUrl) {
		this.redirectUrl = redirectUrl;
	}
	
	
}
