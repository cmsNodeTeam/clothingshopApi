package com.dev.api.service.login;

import javax.servlet.http.HttpServletRequest;

import com.dev.api.schema.CommonResult;
import com.dev.api.schema.login.req.ReqLogin;
import com.dev.api.schema.login.resp.RespLogin;

public interface ILoginService {

	/**
	 * 用户登录
	 * @param params
	 * @return
	 */
	public RespLogin userLogin(ReqLogin params, HttpServletRequest request);
	
	/**
	 * 用户退出
	 * @return
	 */
	public CommonResult userLogout(HttpServletRequest request);
}
