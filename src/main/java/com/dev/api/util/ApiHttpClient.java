package com.dev.api.util;

import java.net.URLDecoder;
import java.security.cert.X509Certificate;
import java.util.Enumeration;
import java.util.LinkedHashMap;

import javax.net.ssl.SSLContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.dev.api.schema.config.CmsApiConfig;
import com.dev.api.schema.config.UrlEnum;

@Component
public class ApiHttpClient {

	@Autowired
	private CmsApiConfig apiConfig;

	@Autowired
	private RestTemplate restTemplate;

	@Bean
	public RestTemplate restTemplate() throws Exception {
		TrustStrategy acceptsStrategy = (X509Certificate[] certs, String authType) -> true;
		SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(acceptsStrategy).build();
		CloseableHttpClient httpClient = HttpClients.custom().setSSLContext(sslContext)
				.setSSLHostnameVerifier(new NoopHostnameVerifier()).build();
		HttpComponentsClientHttpRequestFactory httpFactory = new HttpComponentsClientHttpRequestFactory();
		httpFactory.setConnectTimeout(30 * 60 * 1000);
		httpFactory.setReadTimeout(30 * 60 * 1000);
		httpFactory.setConnectionRequestTimeout(Integer.MAX_VALUE);
		httpFactory.setHttpClient(httpClient);
		return new RestTemplate(httpFactory);
	}

	private HttpHeaders getHeaders() {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		HttpHeaders headers = new HttpHeaders();
		Enumeration<String> headerName = request.getHeaderNames();
		while (headerName.hasMoreElements()) {
			String key = headerName.nextElement();
			headers.set(key, request.getHeader(key));
		}
		return headers;
	}

	private String getHttpUrl(String url) {
		if (!url.startsWith("/")) {
			url = "/" + url;
		}
		return apiConfig.getDomain() + url;
	}

	public <T> T post(UrlEnum urlEnum, Object body, Class<T> responseType, Object... uriVariables) {
		String path = (String) apiConfig.getUrl().get(urlEnum.toString());
		return post(path, body, responseType, uriVariables);
	}

	public <T> T post(String url, Class<T> responseType, Object... uriVariables) {
		return post(url, null, responseType, uriVariables);
	}

	public <T> T post(UrlEnum urlEnum, Class<T> responseType, Object... uriVariables) {
		return post(urlEnum, null, responseType, uriVariables);
	}

	public <T> T post(String url, Object body, Class<T> responseType, Object... uriVariables) {
		if (!url.startsWith("http")) {
			// 没有以http或者https开头就给他加上域名
			url = getHttpUrl(url);
		}
		if (body == null) {
			body = new LinkedHashMap<>();
		}
		HttpEntity<Object> requestEntity = new HttpEntity<Object>(body, getHeaders());
		return restTemplate.exchange(url, HttpMethod.POST, requestEntity, responseType, uriVariables).getBody();
	}
	
	public <T> T get(UrlEnum urlEnum, Class<T> responseType, Object... uriVariables) {
		String path = (String) apiConfig.getUrl().get(urlEnum.toString());
		return get(path, null, responseType, uriVariables);
	}
	
	public <T> T get(UrlEnum urlEnum, String query, Class<T> responseType, Object... uriVariables) {
		String path = (String) apiConfig.getUrl().get(urlEnum.toString());
		return get(path, query, responseType, uriVariables);
	}
	
	public <T> T get(String url, Class<T> responseType, Object... uriVariables) {
		return get(url, null, responseType, uriVariables);
	}
	
	public <T> T get(String url, String query, Class<T> responseType, Object... uriVariables) {
		if (!url.startsWith("http")) {
			// 没有以http或者https开头就给他加上域名
			url = getHttpUrl(url);
		}
		String params = "";
		if(query != null && !query.isEmpty()) {
			try {
				params = URLDecoder.decode(query, "utf-8");
			} catch (Exception e) {
			}
		}
		if(!params.isEmpty()) {
			url += "?" + params;
		}
		HttpEntity<Object> requestEntity = new HttpEntity<Object>(null, getHeaders());
		return restTemplate.exchange(url, HttpMethod.GET, requestEntity, responseType, uriVariables).getBody();
	}
}
