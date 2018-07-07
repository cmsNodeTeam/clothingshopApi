package com.dev.api.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;

import com.dev.api.interceptor.ApiInterceptor;
import com.dev.api.interceptor.GlobalInterceptor;
import com.dev.api.interceptor.WebInterceptor;
import com.dev.api.schema.config.CmsApiConfig;
import com.dev.api.schema.config.CmsIfcConfig;
import com.dev.api.util.GlobalStatus;
import com.dev.api.util.JsonUtils;
import com.dev.api.util.RightsCode;
import com.fasterxml.jackson.databind.ObjectMapper;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Parameter;
import springfox.documentation.service.ResponseMessage;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableSwagger2
@Configuration
public class ApiConfiguration extends WebMvcConfigurationSupport {

	@Autowired
	private CmsIfcConfig ifcConfig;
	
	@Autowired
	private CmsApiConfig apiConfig;
	
	@Resource
    private void configureThymeleafStaticVars(ThymeleafViewResolver viewResolver) {
        if(viewResolver != null) {
            Map<String, Object> vars = new HashMap<>();
            vars.put("globals", new GlobalStatus());
            vars.put("rights", new RightsCode());
            viewResolver.setStaticVariables(vars);
        }
    }
	
	@Override
    public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new ApiInterceptor()).addPathPatterns("/api/*/**");
		registry.addInterceptor(new WebInterceptor()).addPathPatterns("/super/web/*/**");
		registry.addInterceptor(new GlobalInterceptor()).addPathPatterns("/*/**");
    }
	
	@Bean
	public LocaleResolver localeResolver() {
		CookieLocaleResolver cookieLocale = new CookieLocaleResolver();
		// 默认语言
		cookieLocale.setDefaultLocale(Locale.CHINA);
		cookieLocale.setCookieName("superLanguage");
		cookieLocale.setCookieMaxAge(7 * 24 * 3600);
		return cookieLocale;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");

		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");

		registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
	}

	@Bean
	public Docket createLoginApi() {
		return new Docket(DocumentationType.SWAGGER_2).groupName("Login").forCodeGeneration(true).apiInfo(apiInfo())
				.select().apis(RequestHandlerSelectors.basePackage("com.dev.api.controller.login"))
				.paths(PathSelectors.any()).build().globalResponseMessage(RequestMethod.GET, customizeResponseMessage())
				.globalResponseMessage(RequestMethod.POST, customizeResponseMessage())
				.globalOperationParameters(getHeadersParameter());
	}
	
	@Bean
	public Docket createConfigApi() {
		return new Docket(DocumentationType.SWAGGER_2).groupName("Config").forCodeGeneration(true).apiInfo(apiInfo())
				.select().apis(RequestHandlerSelectors.basePackage("com.dev.api.controller.config"))
				.paths(PathSelectors.any()).build().globalResponseMessage(RequestMethod.GET, customizeResponseMessage())
				.globalResponseMessage(RequestMethod.POST, customizeResponseMessage())
				.globalOperationParameters(getHeadersParameter());
	}

	// 构建API文档的详细信息函数
	private ApiInfo apiInfo() {
		return new ApiInfoBuilder()
				// 页面标题
				.title("Clothes Shop RESTful API")
				// 创建人
				.contact(new Contact("Konami.wu", "http://cc:8000/superLogin", "Oliver.wu@shijigroup.com"))
				// 版本号
				.version("1.0")
				// 描述
				.description("Clothes public API").build();
	}

	/**
	 * 自定义返回响应Code
	 * 
	 * @return
	 */
	private List<ResponseMessage> customizeResponseMessage() {
		List<ResponseMessage> list = new ArrayList<ResponseMessage>();

		ResponseMessage message_404 = new ResponseMessageBuilder().code(CodeEnum.ERROR_404.getCode())
				.message(CodeEnum.ERROR_404.getMsg()).build();

		ResponseMessage message_500 = new ResponseMessageBuilder().code(CodeEnum.ERROR_500.getCode())
				.message(CodeEnum.ERROR_500.getMsg()).build();

		ResponseMessage message_null = new ResponseMessageBuilder().code(CodeEnum.ERROR_NULL.getCode())
				.message(CodeEnum.ERROR_NULL.getMsg()).build();

		list.add(message_404);
		list.add(message_500);
		list.add(message_null);
		return list;
	}

	/**
	 * 添加请求头参数
	 * @return
	 */
	private List<Parameter> getHeadersParameter() {
		List<Parameter> headersParams = new ArrayList<Parameter>();
		
		ParameterBuilder idHeader = new ParameterBuilder();
		idHeader.name("id").description("username")
			.modelRef(new ModelRef("string")).parameterType("header")
			.defaultValue(ifcConfig.getUsername()).required(true).build();
		
		ParameterBuilder keyHeader = new ParameterBuilder();
		keyHeader.name("key").description("password")
			.modelRef(new ModelRef("string")).parameterType("header")
			.defaultValue(ifcConfig.getPassword()).required(true).build();
		
		ParameterBuilder languageHeader = new ParameterBuilder();
		languageHeader.name("language").description("user language")
			.modelRef(new ModelRef("string")).parameterType("header")
			.required(false).build();
		
		ParameterBuilder shopidHeader = new ParameterBuilder();
		shopidHeader.name("shopid").description("shop id")
			.modelRef(new ModelRef("string")).parameterType("header")
			.defaultValue(ifcConfig.getShopid()).required(true).build();
		
		ParameterBuilder cmsHeader = new ParameterBuilder();
		cmsHeader.name("cms-interface").description("cms interface flag")
			.modelRef(new ModelRef("string")).parameterType("header")
			.defaultValue(apiConfig.getHeader()).required(true).build();

		headersParams.add(idHeader.build());
		headersParams.add(keyHeader.build());
		headersParams.add(languageHeader.build());
		headersParams.add(shopidHeader.build());
		headersParams.add(cmsHeader.build());
		return headersParams;
	}
	
	@Override
	protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
		converters.stream().filter((c) -> c instanceof AbstractJackson2HttpMessageConverter)
			.forEach((c) -> {
				ObjectMapper mapper = JsonUtils.getMapper();
				((AbstractJackson2HttpMessageConverter)c).setObjectMapper(mapper);
		});
	}
	
}
