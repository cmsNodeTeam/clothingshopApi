package com.dev.api.service.config.impl;

import org.springframework.stereotype.Service;

import com.dev.api.schema.config.req.Req_ConfigQuery;
import com.dev.api.schema.config.resp.Resp_ConfigQuery;
import com.dev.api.service.config.IConfigService;

@Service
public class ConfigBean implements IConfigService{

	@Override
	public Resp_ConfigQuery getConfigList(Req_ConfigQuery params) {
		Resp_ConfigQuery list = new Resp_ConfigQuery();
		return list;
	}

}
