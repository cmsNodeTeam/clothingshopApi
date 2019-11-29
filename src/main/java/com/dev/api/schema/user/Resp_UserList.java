package com.dev.api.schema.user;

import java.util.List;

import com.dev.api.schema.CommonResult;
import com.dev.api.schema.pojo.Setup;
import com.dev.api.schema.pojo.User;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "RespUserList")
public class Resp_UserList extends CommonResult{

	@ApiModelProperty(value = "用户列表", required = true)
	private List<User> users;
	
	@ApiModelProperty(value = "用户列表", required = true)
	private List<Setup> setup;

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public List<Setup> getSetup() {
		return setup;
	}

	public void setSetup(List<Setup> setup) {
		this.setup = setup;
	}
	
}
