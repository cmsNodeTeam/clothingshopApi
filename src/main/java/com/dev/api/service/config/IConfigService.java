package com.dev.api.service.config;

import com.dev.api.schema.config.req.Req_ConfigQuery;
import com.dev.api.schema.config.resp.Resp_ConfigQuery;

public interface IConfigService {
	public Resp_ConfigQuery getConfigList(Req_ConfigQuery params);//获取系统配置列表
}
