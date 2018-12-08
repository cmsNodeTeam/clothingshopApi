package com.dev.api.schema;

public class CommonCode {
	public static final int SUCCESS = 1;
	public static final int FAILED = 0;
	public static final int REDIRECT = -302;
	
	public static final int ERROR_HEADER = -503;
	public static final int INVALID_SESSION = -201;
	public static final int SUCCESS_LOGIN = -302;
	public static final int SUCCESS_LOGOUT = -302;
	public static final String ERROR_HEADER_MSG = "请求头错误";
	public static final String INVALID_SESSION_MSG = "无效的凭证";
	public static final String SUCCESS_LOGIN_MSG = "成功登录";
	public static final String SUCCESS_LOGOUT_MSG = "成功退出";
}
