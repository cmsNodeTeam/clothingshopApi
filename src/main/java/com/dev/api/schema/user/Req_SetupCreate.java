package com.dev.api.schema.user;

import com.dev.api.schema.pojo.Setup;

import io.swagger.annotations.ApiModel;

@ApiModel(value = "ReqSetupCreate")
public class Req_SetupCreate {

	private Setup setup;

	public Setup getSetup() {
		return setup;
	}

	public void setSetup(Setup setup) {
		this.setup = setup;
	}
	
}