package com.dev.api.schema.config.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "ConfigQuery", description = "查询系统配置")
public class Req_ConfigQuery {
	@ApiModelProperty(value = "配置组名", required = false)
	private String groupName;

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	
}
