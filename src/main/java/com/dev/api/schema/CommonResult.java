package com.dev.api.schema;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "CommonResult", description = "Response common results")
public class CommonResult {
	@ApiModelProperty(value = "Response Code", required = true)
	private Integer code = CommonCode.FAILED;

	@ApiModelProperty(value = "Response error message")
	private String msg;
	
	@ApiModelProperty(value = "Response redirect url")
	private String redirectURL;

	public CommonResult() {
	}

	public CommonResult(String msg) {
		this(0, msg);
	}

	public CommonResult(Integer code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	public CommonResult(Integer code) {
		this.code = code;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getRedirectURL() {
		return redirectURL;
	}

	public void setRedirectURL(String redirectURL) {
		this.redirectURL = redirectURL;
	}

}
