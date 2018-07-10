package com.dev.api.schema.config.resp;

import com.dev.api.schema.config.SystemConfig;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "ConfigQueryResult", description = "查询系统配置列表")
public class Resp_ConfigQuery {
	@ApiModelProperty(value = "response code", required = true)
	private Integer code;
	
	@ApiModelProperty(value = "response message", required = false)
	private String msg;
	
	@ApiModelProperty(value = "configuration", required = true)
	private SystemConfig config;

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public SystemConfig getConfig() {
		return config;
	}

	public void setConfig(SystemConfig config) {
		this.config = config;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	
}
