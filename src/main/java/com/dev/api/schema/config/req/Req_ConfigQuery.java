package com.dev.api.schema.config.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "ConfigQuery", description = "查询系统配置")
public class Req_ConfigQuery {
	@ApiModelProperty(value = "系统配置的Key", required = true)
	private String key;
	
	@ApiModelProperty(value = "系统配置的组名", required = false)
	private String groupName;

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	
}
