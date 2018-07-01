package com.dev.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableSwagger2
@Configuration
public class ApiConfiguration extends WebMvcConfigurationSupport{

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
      registry.addResourceHandler("swagger-ui.html")
              .addResourceLocations("classpath:/META-INF/resources/");

      registry.addResourceHandler("/webjars/**")
              .addResourceLocations("classpath:/META-INF/resources/webjars/");
      
      registry.addResourceHandler("/static/**")
      		  .addResourceLocations("classpath:/static/");
  }
	
	@Bean
	public Docket createLoginApi() {
		return new Docket(DocumentationType.SWAGGER_2).groupName("Login").forCodeGeneration(true)
				.apiInfo(apiInfo()).select().apis(RequestHandlerSelectors.basePackage("com.dev.api.controller.login.rest"))
				.paths(PathSelectors.any()).build();
	}

	// 构建API文档的详细信息函数
	private ApiInfo apiInfo() {
		return new ApiInfoBuilder()
				// 页面标题
				.title("Clothes Shop RESTful API")
				// 创建人
				.contact(new Contact("Konami.wu", "https://cc:3001/superLogin", "Oliver.wu@shijigroup.com"))
				// 版本号
				.version("1.0")
				// 描述
				.description("Clothes public API").build();
	}
}
