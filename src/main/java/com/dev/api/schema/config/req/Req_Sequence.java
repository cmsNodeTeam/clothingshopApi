package com.dev.api.schema.config.req;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "SequenceId", description = "查询某个类型的序列化id")
public class Req_Sequence {
	@ApiModelProperty(value = "类型", required = true, allowableValues = "MESSAGE,ROOMNO")
	private String type;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
}
