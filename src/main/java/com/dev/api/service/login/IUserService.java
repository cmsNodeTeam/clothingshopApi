package com.dev.api.service.login;

import com.dev.api.schema.CommonResult;
import com.dev.api.schema.pojo.Setup;
import com.dev.api.schema.pojo.User;
import com.dev.api.schema.user.Resp_UserList;

public interface IUserService {

	public Resp_UserList getUser();
	
	public CommonResult createSetup(Setup params);
	
	public Resp_UserList getUserByName(String name);
	
	public Resp_UserList save(User u);
}
