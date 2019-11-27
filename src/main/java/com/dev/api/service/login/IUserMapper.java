package com.dev.api.service.login;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.api.schema.pojo.User;

public interface IUserMapper extends JpaRepository<User, String>{

}
