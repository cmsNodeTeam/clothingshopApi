package com.dev.api.schema.login.req;

import io.swagger.annotations.ApiModelProperty;

public class ReqLogin {

	@ApiModelProperty(value = "用户名", required = true)
	private String adminId;
	
	@ApiModelProperty(value = "用户密码", required = true)
	private String adminPws;

	public String getAdminId() {
		return adminId;
	}

	public void setAdminId(String adminId) {
		this.adminId = adminId;
	}

	public String getAdminPws() {
		return adminPws;
	}

	public void setAdminPws(String adminPws) {
		this.adminPws = adminPws;
	}
	
}
