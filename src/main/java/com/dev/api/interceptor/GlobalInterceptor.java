package com.dev.api.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;

import com.dev.api.config.CodeEnum;
import com.dev.api.schema.exception.ApiException;

public class GlobalInterceptor implements HandlerInterceptor {
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		if(response.getStatus() == 404) {
			throw new ApiException(CodeEnum.ERROR_404.getCode(), CodeEnum.ERROR_404.getMsg());
		}
		return true;
	}
	
}
