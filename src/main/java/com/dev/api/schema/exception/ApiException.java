package com.dev.api.schema.exception;

import com.dev.api.schema.CommonCode;

public class ApiException extends RuntimeException {

	private static final long serialVersionUID = 6413405860138462966L;

	private Integer code = CommonCode.FAILED;

	public ApiException() {
		super();
	}

	public ApiException(Integer code, String message) {
		super(message);
		this.code = code;
	}

	public ApiException(Integer code) {
		super();
		this.code = code;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

}
