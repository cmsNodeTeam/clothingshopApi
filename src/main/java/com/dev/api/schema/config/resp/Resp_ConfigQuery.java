package com.dev.api.schema.config.resp;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "ConfigQueryResult", description = "查询系统配置集合")
public class Resp_ConfigQuery {
	@ApiModelProperty(value = "response code", required = true)
	private Integer code;

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}
	
	
}
