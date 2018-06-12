package com.dev.api.schema.login.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "LoginSchema", description = "Login")
public class Req_Login {
	@ApiModelProperty(value = "adminId", required = true)
	private String adminId;

	@ApiModelProperty(value = "password")
	private String password;

	public String getAdminId() {
		return adminId;
	}

	public void setAdminId(String adminId) {
		this.adminId = adminId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
