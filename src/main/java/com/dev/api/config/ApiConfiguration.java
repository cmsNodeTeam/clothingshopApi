package com.dev.api.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import com.dev.api.interceptor.GlobalInterceptor;
import com.dev.api.schema.config.CmsIfcConfig;
import com.dev.api.util.JsonUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.AllowableListValues;
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

	// @Autowired
	// private Environment env;

	@Autowired
	private CmsIfcConfig ifcConfig;

	private List<ResponseMessage> responseMessage;

	private List<Parameter> headerParameter;

	@Override
	protected void addCorsMappings(CorsRegistry registry) {
		super.addCorsMappings(registry);
		registry.addMapping("/**").allowedOrigins("*").allowedMethods("*")
			.allowedHeaders("*").maxAge(3600);
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new GlobalInterceptor()).addPathPatterns("/*/**");
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

	@Bean
	public Docket createLoginApi() {
		return new Docket(DocumentationType.SWAGGER_2).groupName("Login").forCodeGeneration(true).apiInfo(apiInfo())
				.select().apis(RequestHandlerSelectors.basePackage("com.dev.api.controller.login"))
				.paths(PathSelectors.any()).build()
				.globalResponseMessage(RequestMethod.POST, customizeResponseMessage())
				.globalOperationParameters(getLoginControllerParameter());
	}
	
	@Bean
	public Docket createUploadApi() {
		return new Docket(DocumentationType.SWAGGER_2).groupName("Upload").forCodeGeneration(true).apiInfo(apiInfo())
				.select().apis(RequestHandlerSelectors.basePackage("com.dev.api.controller.upload"))
				.paths(PathSelectors.any()).build()
				.globalResponseMessage(RequestMethod.POST, customizeResponseMessage())
				.globalOperationParameters(getLoginControllerParameter());
	}

	// 构建API文档的详细信息函数
	private ApiInfo apiInfo() {
		return new ApiInfoBuilder()
				// 页面标题
				.title("Clothes Shop RESTful API")
				// 创建人
				.contact(new Contact("Oliver", ifcConfig.getLoginPath(), "Oliver.wu@shijigroup.com"))
				// 版本号
				.version("1.0")
				// 描述
				.description("Clothes Public API").build();
	}

	/**
	 * 自定义返回响应Code
	 * 
	 * @return
	 */
	private List<ResponseMessage> customizeResponseMessage() {
		if (responseMessage == null) {
			responseMessage = new ArrayList<>();

			ResponseMessage message_404 = new ResponseMessageBuilder().code(CodeEnum.ERROR_404.getCode())
					.message(CodeEnum.ERROR_404.getMsg()).build();

			ResponseMessage message_500 = new ResponseMessageBuilder().code(CodeEnum.ERROR_500.getCode())
					.message(CodeEnum.ERROR_500.getMsg()).build();

			ResponseMessage message_null = new ResponseMessageBuilder().code(CodeEnum.ERROR_NULL.getCode())
					.message(CodeEnum.ERROR_NULL.getMsg()).build();

			ResponseMessage message_method = new ResponseMessageBuilder().code(CodeEnum.METHOD_NOT_SUPPORTED.getCode())
					.message(CodeEnum.METHOD_NOT_SUPPORTED.getMsg()).build();

			responseMessage.add(message_404);
			responseMessage.add(message_500);
			responseMessage.add(message_null);
			responseMessage.add(message_method);
		}
		return responseMessage;
	}

	private List<Parameter> getLoginControllerParameter() {
		List<Parameter> params = getHeadersParameter();
		List<Parameter> tempParams = new ArrayList<>();
		for (int i = 1; i < params.size(); i++) {
			tempParams.add(params.get(i));
		}
		return tempParams;
	}

	/**
	 * 添加请求头参数
	 * 
	 * @return
	 */
	private List<Parameter> getHeadersParameter() {
		if (headerParameter == null) {
			headerParameter = new ArrayList<>();

			ParameterBuilder credential = new ParameterBuilder();
			credential.name("credential").description("用户凭证").modelRef(new ModelRef("string")).parameterType("header")
					.required(true).build();

			ParameterBuilder language = new ParameterBuilder();
			List<String> languageList = new ArrayList<>();
			languageList.add("EN");
			languageList.add("CN");
			AllowableListValues languageAllow = new AllowableListValues(languageList, "string");
			language.name("language").description("用户语言").modelRef(new ModelRef("string")).parameterType("header")
					.required(false).allowableValues(languageAllow).build();

			headerParameter.add(credential.build());
			headerParameter.add(language.build());
		}
		return headerParameter;
	}

	@Override
	protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
		converters.stream().filter((c) -> c instanceof AbstractJackson2HttpMessageConverter).forEach((c) -> {
			ObjectMapper mapper = JsonUtils.getMapper();
			((AbstractJackson2HttpMessageConverter) c).setObjectMapper(mapper);
		});
	}

}
