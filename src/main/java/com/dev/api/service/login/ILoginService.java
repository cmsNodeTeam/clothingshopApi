package com.dev.api.service.login;

import com.dev.api.schema.login.req.Req_Login;
import com.dev.api.schema.login.resp.Resp_Login;

public interface ILoginService {
	public Resp_Login userLogin(Req_Login params);
}
