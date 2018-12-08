package com.dev.api.service.login.impl;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.api.schema.CommonResult;
import com.dev.api.schema.login.req.ReqLogin;
import com.dev.api.schema.login.resp.RespLogin;
import com.dev.api.service.login.ILoginService;
import com.dev.api.util.ApiHttpClient;

@Service
public class LoginBean implements ILoginService{

	@Autowired
	private ApiHttpClient httpClient;
	
	@Override
	public RespLogin userLogin(ReqLogin params, HttpServletRequest request) {
		return httpClient.post(request.getRequestURI(), params, RespLogin.class);
	}

	@Override
	public CommonResult userLogout(HttpServletRequest request) {
		return httpClient.post(request.getRequestURI(), CommonResult.class);
	}

}
