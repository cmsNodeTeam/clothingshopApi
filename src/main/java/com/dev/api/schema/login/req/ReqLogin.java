package com.dev.api.schema.login.req;

import io.swagger.annotations.ApiModelProperty;

public class ReqLogin {

	@ApiModelProperty(value = "用户名", required = true, example="OLIVER")
	private String adminId;
	
	@ApiModelProperty(value = "用户密码", required = true, example="6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b")
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
