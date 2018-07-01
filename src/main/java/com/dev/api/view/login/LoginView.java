package com.dev.api.view.login;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class LoginView {

	@GetMapping("superLogin")
	public String gotoLogin() {
		return "super/login/admin_login";
	}
}
