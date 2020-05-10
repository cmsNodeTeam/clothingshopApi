package com.dev.api.service.login;

import java.util.List;

public interface DaoRemote<T> {

	public <T> T save(T t);
	
	public <T> List<T> getObjectList(String jpql, Object... objects);
}
