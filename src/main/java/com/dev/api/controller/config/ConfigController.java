package com.dev.api.controller.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.api.schema.config.req.Req_ConfigQuery;
import com.dev.api.schema.config.req.Req_Sequence;
import com.dev.api.schema.config.resp.Resp_ConfigQuery;
import com.dev.api.schema.config.resp.Resp_Sequence;
import com.dev.api.service.config.IConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(tags = "Config api interface", description = "Config api")
@RestController
@RequestMapping(value = "/api/config")
public class ConfigController {
	@Autowired
	private IConfigService configService;

	@ApiOperation(value = "系统配置接口", notes = "查询系统配置列表")
	@PostMapping("query")
	public Resp_ConfigQuery getConfigList(@RequestBody Req_ConfigQuery query) {
		return configService.getConfigList(query);
	}
	
	@ApiOperation(value = "获取序列化ID", notes = "根据类型获取唯一序列化ID")
	@PostMapping("sequence_id")
	public Resp_Sequence getSequenceId(@RequestBody Req_Sequence type) {
		return configService.getSequence(type);
	}
}
