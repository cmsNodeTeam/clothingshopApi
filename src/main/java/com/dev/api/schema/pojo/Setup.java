package com.dev.api.schema.pojo;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Setup {
	@Id
	private String name;
	
	private String value;
	
	private Boolean allow;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Boolean getAllow() {
		return allow;
	}

	public void setAllow(Boolean allow) {
		this.allow = allow;
	}
	
}
