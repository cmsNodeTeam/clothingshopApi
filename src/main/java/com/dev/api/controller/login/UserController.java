package com.dev.api.controller.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.api.schema.user.Resp_UserList;
import com.dev.api.service.login.IUserService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(tags = "User api interface", description = "User api")
@RestController
@RequestMapping(value = "/api/user")
public class UserController {

	@Autowired
	private IUserService userService;
	
	@ApiOperation(value = "获取用户列表",  notes = "获取用户列表")
	@GetMapping("/search")
	public Resp_UserList userLogin() {
		return userService.getUser();
	}
}
