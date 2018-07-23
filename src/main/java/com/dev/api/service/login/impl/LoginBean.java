package com.dev.api.service.login.impl;

import org.springframework.stereotype.Service;

import com.dev.api.schema.login.req.Req_Login;
import com.dev.api.schema.login.resp.Resp_Login;
import com.dev.api.service.login.ILoginService;

@Service
public class LoginBean implements ILoginService{

	@Override
	public Resp_Login userLogin(Req_Login params) {
		Resp_Login login = new Resp_Login();
		login.setSession("sessionid");
		return login;
	}

}
