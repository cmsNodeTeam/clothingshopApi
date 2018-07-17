package com.dev.api.schema.config.resp;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "SquenceIdResult", description = "得到序列化id")
public class Resp_Sequence {
	@ApiModelProperty(value = "response code", required = true)
	private Integer code;
	
	@ApiModelProperty(value = "response message", required = false)
	private String msg;
	
	@ApiModelProperty(value = "序列化id值", required = true)
	private String sequenceId;

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

	public String getSequenceId() {
		return sequenceId;
	}

	public void setSequenceId(String sequenceId) {
		this.sequenceId = sequenceId;
	}
	
	
}
