package com.dev.api.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.api.schema.login.SwaggerConfig;

@Service
public class SwaggerService {
	
	@Autowired
	private SwaggerConfig config;
	
	public Map<String, Object> getSwaggerConfig(){
		Map<String, Object> map = new HashMap<>();
		map.put("version", config.getVersion());
		for (int i = 0; i < config.getUser().size(); i++) {
			map.put("user[" + i + "]", config.getUser().get(i));
		}
		Set<String> keySet = config.getLogin().keySet();
		for(String key: keySet) {
			map.put(key, config.getLogin().get(key));
		}
		return map;
	}
}
