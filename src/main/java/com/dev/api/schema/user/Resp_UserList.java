package com.dev.api.schema.user;

import java.util.List;

import com.dev.api.schema.CommonResult;
import com.dev.api.schema.pojo.User;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "RespUserList")
public class Resp_UserList extends CommonResult{

	@ApiModelProperty(value = "用户列表", required = true)
	private List<User> users;

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}
	
}
