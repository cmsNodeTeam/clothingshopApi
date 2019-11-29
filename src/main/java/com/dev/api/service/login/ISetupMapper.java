package com.dev.api.service.login;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.api.schema.pojo.Setup;

public interface ISetupMapper extends JpaRepository<Setup, String>{

}
