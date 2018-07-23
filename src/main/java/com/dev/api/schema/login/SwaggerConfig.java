package com.dev.api.schema.login;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Swagger 读取配置文件
 * @author CC
 *
 */
@Component
@ConfigurationProperties(prefix="swagger")
public class SwaggerConfig {
	public String version;
	public List<String> user = new ArrayList<>();
	public Map<String, String> login = new HashMap<>();
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public List<String> getUser() {
		return user;
	}
	public void setUser(List<String> user) {
		this.user = user;
	}
	public Map<String, String> getLogin() {
		return login;
	}
	public void setLogin(Map<String, String> login) {
		this.login = login;
	}
	
}
