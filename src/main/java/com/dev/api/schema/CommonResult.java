package com.dev.api.schema;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "CommonResult", description = "Response common results")
public class CommonResult<T> {
	@ApiModelProperty(value = "Response Code", required = true)
	private Integer code = 0;

	@ApiModelProperty(value = "Response Data")
	private T data;

	@ApiModelProperty(value = "Response error message")
	private String msg;

	public CommonResult() {
	}

	public CommonResult(String msg) {
		this(0, msg);
	}

	public CommonResult(Integer code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	public CommonResult(T data) {
		this(1, data);
	}

	public CommonResult(Integer code, T data) {
		this.code = code;
		this.data = data;
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

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

}
