package com.dev.api.schema.login.resp;

import com.dev.api.schema.CommonResult;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "RespLogin")
public class RespLogin extends CommonResult{

	@ApiModelProperty(value = "用户凭证", required = true)
	private String credential;

	public String getCredential() {
		return credential;
	}

	public void setCredential(String credential) {
		this.credential = credential;
	}
	
}
