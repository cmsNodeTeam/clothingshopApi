package com.dev.api.service.login.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.api.schema.CommonCode;
import com.dev.api.schema.user.Resp_UserList;
import com.dev.api.service.login.IUserMapper;
import com.dev.api.service.login.IUserService;

@Service
public class UserBean implements IUserService{

	@Autowired
	private IUserMapper userRemote;
	
	@Override
	public Resp_UserList getUser() {
		Resp_UserList resp = new Resp_UserList();
		resp.setCode(CommonCode.SUCCESS);
		resp.setUsers(userRemote.findAll());
		return resp;
	}

}
