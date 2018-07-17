package com.dev.api.service.config;

import com.dev.api.schema.config.req.Req_ConfigQuery;
import com.dev.api.schema.config.req.Req_Sequence;
import com.dev.api.schema.config.resp.Resp_ConfigQuery;
import com.dev.api.schema.config.resp.Resp_Sequence;

public interface IConfigService {
	/**
	 * 获取系统配置列表
	 * @param params
	 * @return
	 */
	public Resp_ConfigQuery getConfigList(Req_ConfigQuery params);
	
	/**
	 * 根据类型获取序列号
	 */
	public Resp_Sequence getSequence(Req_Sequence params);
}
