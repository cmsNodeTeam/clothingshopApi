package com.dev.api.config;

public enum CodeEnum {
	ERROR_404(1404, "Url不存在."),
	ERROR_500(1500, "服务器报错."),
	ERROR_NULL(1900, "服务器报空指针异常.");
	
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
