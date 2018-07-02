package com.dev.api.controller.swagger;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.api.service.SwaggerService;

@RestController
@RequestMapping("/")
public class SwaggerController {
	
	@Autowired
	private SwaggerService service;
	
	@GetMapping("swagger/config")
	public Map<String, Object> getSwaggerConfig(){
		return service.getSwaggerConfig();
	}
	
}
