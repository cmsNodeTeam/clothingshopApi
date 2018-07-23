package com.dev.api.schema.user;

import org.springframework.util.StringUtils;

public class UserSession {
	
	private String username;
	
	private String sessionid;
	
	private String language;
	
	private String rights;
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getSessionid() {
		return sessionid;
	}
	
	public void setSessionid(String sessionid) {
		this.sessionid = sessionid;
	}
	
	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}
	
	public String getRights() {
		return StringUtils.isEmpty(this.rights) ? "" : this.rights;
	}
	
	public void setRights(String rights) {
		this.rights = rights;
	}
	
	public boolean isSupervisor() {
		if(StringUtils.isEmpty(this.username) || StringUtils.isEmpty(this.rights)) {
			return false;
		}
		if(this.username.equals("SUPERVISOR") || this.rights.equals("ALL")) {
			return true;
		}
		return false;
	}
	
}
