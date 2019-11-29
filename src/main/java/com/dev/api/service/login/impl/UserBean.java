package com.dev.api.service.login.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.api.schema.CommonCode;
import com.dev.api.schema.CommonResult;
import com.dev.api.schema.pojo.Setup;
import com.dev.api.schema.pojo.User;
import com.dev.api.schema.user.Resp_UserList;
import com.dev.api.service.login.DaoRemote;
import com.dev.api.service.login.ISetupMapper;
import com.dev.api.service.login.IUserMapper;
import com.dev.api.service.login.IUserService;

@Service
public class UserBean implements IUserService{

	@Autowired
	private IUserMapper userRemote;
	
	@Autowired
	private ISetupMapper setupRemote;
	
	@Autowired
	private DaoRemote<?> daoRemote;
	
	@Override
	public Resp_UserList getUser() {
		Resp_UserList resp = new Resp_UserList();
		resp.setCode(CommonCode.SUCCESS);
		resp.setUsers(userRemote.findAll());
		return resp;
	}

	@Override
	public CommonResult createSetup(Setup params) {
		CommonResult resp = new CommonResult();
		setupRemote.save(params);
		resp.setCode(CommonCode.SUCCESS);
		return resp;
	}

	@Override
	public Resp_UserList getUserByName(String name) {
		Resp_UserList resp = new Resp_UserList();
		resp.setCode(CommonCode.SUCCESS);
		List<User> list = new ArrayList<>();
		list.add(userRemote.findUserByName(name));
		resp.setUsers(list);
		return resp;
	}

	@Override
	public Resp_UserList save(User u) {
		Resp_UserList resp = new Resp_UserList();
		resp.setCode(CommonCode.SUCCESS);
		
		String jpql = "select u from User as u where uname=?1 and password=?2";
		List<User> results = daoRemote.getObjectList(jpql, "123", "qq");
		List<Setup> res2 = daoRemote.getObjectList("select q from Setup as q");
		
		resp.setSetup(res2 == null ? new ArrayList<>() : res2);
		resp.setUsers(results == null ? new ArrayList<>() : results);
		return resp;
	}

}
