package com.dev.api.controller.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dev.api.schema.login.req.Req_Login;
import com.dev.api.schema.login.resp.Resp_Login;
import com.dev.api.service.login.ILoginService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(tags = "Login API interface", description = "Login API")
@RestController
@RequestMapping(value = "/api/user")
public class LoginController {
	@Autowired
	private ILoginService loginService;

	@ApiOperation(value = "Login system", notes = "User login system")
	@RequestMapping(value = "login", method = RequestMethod.POST)
	public Resp_Login userLogin(@RequestBody Req_Login login) {
		return loginService.userLogin(login);
	}
}
