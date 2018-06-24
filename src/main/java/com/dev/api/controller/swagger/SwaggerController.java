package com.dev.api.controller.swagger;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.api.service.SwaggerService;

@RestController
public class SwaggerController {
	
	@Autowired
	private SwaggerService service;
	
	@PostMapping("swagger/config")
	public Map<String, Object> getSwaggerConfig(){
		return service.getSwaggerConfig();
	}
	
}
