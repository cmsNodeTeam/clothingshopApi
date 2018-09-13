package com.dev.api.aop;

import java.util.Date;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ApiAspect {

	static final ThreadLocal<Long> currentDate = new ThreadLocal<>();
	
	@Pointcut("within(com.dev.api.controller..*)")
    public void logPointCut() {}

	@Before(value = "logPointCut()")
	public void doGlobalBefore(JoinPoint joinPoint) {
		currentDate.set(new Date().getTime());
	}
	
	@After(value = "logPointCut()")
	public void doGlobalAfter(JoinPoint joinPoint) {
		Date date = new Date();
		String clazzName = joinPoint.getSignature().getDeclaringTypeName();
		String methodName = joinPoint.getSignature().getName();
		
		System.out.println(clazzName);
		System.out.println(methodName);
		System.out.println("耗时:" + (date.getTime() - currentDate.get()) + "ms");
	}
}
