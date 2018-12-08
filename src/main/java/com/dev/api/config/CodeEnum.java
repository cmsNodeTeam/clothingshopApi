package com.dev.api.config;

public enum CodeEnum {
	ERROR_404(-404, "地址不存在"),
	ERROR_500(-500, "服务器报错"),
	METHOD_NOT_SUPPORTED(-504, "请求方式不支持"),
	ERROR_NULL(-505, "服务器报空指针异常");
	
	private Integer code;
	
	private String msg;

	private CodeEnum(Integer code, String msg){
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
