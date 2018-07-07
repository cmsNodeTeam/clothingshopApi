package com.dev.api.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.HandlerInterceptor;

import com.dev.api.util.ServiceReferenceContext;

public class ApiInterceptor implements HandlerInterceptor {
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.add("id", request.getHeader("id") == null ? "" : request.getHeader("id"));
		headers.add("key", request.getHeader("key") == null ? "" : request.getHeader("key"));
		headers.add("shopid", request.getHeader("shopid") == null ? "" : request.getHeader("shopid"));
		headers.add("language", request.getHeader("language") == null ? "" : request.getHeader("language"));
		headers.add("cms-interface", request.getHeader("cms-interface") == null ? "" : request.getHeader("cms-interface"));
		ServiceReferenceContext.setApiHeaders(headers);
		return true;
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		ServiceReferenceContext.setApiHeaders(null);
	}

}
