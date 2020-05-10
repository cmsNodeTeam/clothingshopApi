package com.dev.api.service.login;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.api.schema.pojo.User;

public interface IUserMapper extends JpaRepository<User, String>{

	@Query("select u from User as u where u.uname=:name")
	public User findUserByName(@Param("name") String name);
}
