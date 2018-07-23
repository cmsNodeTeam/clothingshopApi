package com.dev.api.config;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dev.api.schema.CommonResult;

@ControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(Exception.class)
    @ResponseBody
    public CommonResult errorResult(Exception e,HttpServletRequest request) {
		CommonResult result = new CommonResult();
		e.printStackTrace();
		return result;
	}
}
