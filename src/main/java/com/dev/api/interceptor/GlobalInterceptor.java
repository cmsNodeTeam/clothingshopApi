package com.dev.api.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;

import com.dev.api.schema.CommonCode;
import com.dev.api.schema.exception.RedirectException;
import com.dev.api.schema.user.UserSession;
import com.dev.api.util.ServiceReferenceContext;

public class GlobalInterceptor implements HandlerInterceptor {
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		UserSession session = (UserSession) request.getSession().getAttribute(CommonCode.sessionName);
		if(session == null) {
			String ajaxRequest = request.getHeader("X-Requested-With");
			String contextPath = request.getContextPath();
			if(ajaxRequest != null && ajaxRequest.equals("XMLHttpRequest")) {
				throw new RedirectException("/superLogin", "");
			}
			response.sendRedirect(contextPath + "/superLogin");
			return false;
		}
		
		ServiceReferenceContext.setUserSession(session);
		return true;
	}
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		ServiceReferenceContext.setUserSession(null);
	}
}
