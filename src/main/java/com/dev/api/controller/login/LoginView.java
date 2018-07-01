package com.dev.api.controller.login;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class LoginView {

	@GetMapping("login")
	public String gotoLogin() {
		return "login/login";
	}
}
