package com.dev.api.schema;

import io.swagger.annotations.ApiModelProperty;

public class CommonResult {
	@ApiModelProperty(value = "响应代码", required = true)
	private Integer code = CommonCode.FAILED;

	@ApiModelProperty(value = "错误信息", required = false)
	private String msg;

	public CommonResult() {
	}

	public CommonResult(String msg) {
		this(CommonCode.FAILED, msg);
	}

	public CommonResult(Integer code, String msg) {
		this.code = code;
		this.msg = msg;
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

}
