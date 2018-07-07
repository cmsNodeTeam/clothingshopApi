package com.dev.api.schema.config;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "SystemConfig", description = "系统配置Schema")
public class SystemConfig {
	@ApiModelProperty(value = "Key", required = true)
	private String key;
	
	@ApiModelProperty(value = "组名", required = false)
	private String groupName;
	
	@ApiModelProperty(value = "值", required = true)
	private String value;
	
	@ApiModelProperty(value = "描述", required = true)
	private String desc;

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}
	
	
}
