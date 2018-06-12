package com.dev.api.schema.login.resp;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "LoginResponse", description = "Login response")
public class Resp_Login {
	@ApiModelProperty(value = "session")
	private String session;

	public String getSession() {
		return session;
	}

	public void setSession(String session) {
		this.session = session;
	}
	
}
