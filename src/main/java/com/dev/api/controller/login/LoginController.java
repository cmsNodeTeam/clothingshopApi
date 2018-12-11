package com.dev.api.controller.login;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.api.schema.CommonCode;
import com.dev.api.schema.CommonResult;
import com.dev.api.schema.login.req.ReqLogin;
import com.dev.api.schema.login.resp.RespLogin;
import com.dev.api.service.login.ILoginService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Api(tags = "Login api interface", description = "Login api")
@RestController
@RequestMapping(value = "/api/user")
public class LoginController {

	@Autowired
	private ILoginService loginService;
	
	@ApiOperation(value = "用户登录", notes = "用户登录接口")
	@PostMapping("/login")
	@ApiResponses(value = { 
		@ApiResponse(code = CommonCode.ERROR_HEADER, message = CommonCode.ERROR_HEADER_MSG)
		,@ApiResponse(code = CommonCode.SUCCESS_LOGIN, message = CommonCode.SUCCESS_LOGIN_MSG)
	})
	public RespLogin userLogin(@RequestBody ReqLogin params, HttpServletRequest request) {
		return loginService.userLogin(params, request);
	}
	
	@ApiOperation(value = "用户退出", notes = "用户退出接口")
	@PostMapping("/logout")
	@ApiResponses(value = { 
		@ApiResponse(code = CommonCode.INVALID_SESSION, message = CommonCode.INVALID_SESSION_MSG)
		,@ApiResponse(code = CommonCode.SUCCESS_LOGOUT, message = CommonCode.SUCCESS_LOGOUT_MSG)
	})
	public CommonResult userLogout(@RequestHeader String credential, HttpServletRequest request) {
		return loginService.userLogout(request);
	}
}
