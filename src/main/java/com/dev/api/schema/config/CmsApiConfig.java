package com.dev.api.schema.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="cms")
public class CmsApiConfig {

	public String domain;
	
	public String header;
	
	public Map<String, Object> url = new HashMap<>();

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getHeader() {
		return header;
	}

	public void setHeader(String header) {
		this.header = header;
	}

	public Map<String, Object> getUrl() {
		return url;
	}

	public void setUrl(Map<String, Object> url) {
		this.url = url;
	}
	
	
}
