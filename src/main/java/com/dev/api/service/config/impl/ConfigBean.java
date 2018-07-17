package com.dev.api.service.config.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.api.schema.config.UrlEnum;
import com.dev.api.schema.config.req.Req_ConfigQuery;
import com.dev.api.schema.config.req.Req_Sequence;
import com.dev.api.schema.config.resp.Resp_ConfigQuery;
import com.dev.api.schema.config.resp.Resp_Sequence;
import com.dev.api.service.config.IConfigService;
import com.dev.api.util.ApiHttpClient;

@Service
public class ConfigBean implements IConfigService{

	@Autowired
	private ApiHttpClient httpClient;
	
	@Override
	public Resp_ConfigQuery getConfigList(Req_ConfigQuery params) {
		return httpClient.post(UrlEnum.CONFIG, params
				, Resp_ConfigQuery.class, "search");
	}

	@Override
	public Resp_Sequence getSequence(Req_Sequence params) {
		return httpClient.post(UrlEnum.SEQUENCE, params
				, Resp_Sequence.class, "getid");
	}

}
