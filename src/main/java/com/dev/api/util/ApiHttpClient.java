package com.dev.api.util;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;

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
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.dev.api.schema.config.CmsApiConfig;
import com.dev.api.schema.config.UrlEnum;

@Component
public class ApiHttpClient {
	
	@Autowired
	private CmsApiConfig apiConfig;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Bean
	public RestTemplate restTemplate() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException{
		TrustStrategy acceptsStrategy = (X509Certificate[] certs, String authType) -> true;
		SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(acceptsStrategy).build();
		CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLContext(sslContext).setSSLHostnameVerifier(new NoopHostnameVerifier())
                .build();
		HttpComponentsClientHttpRequestFactory httpFactory = new HttpComponentsClientHttpRequestFactory();
		httpFactory.setConnectTimeout(30 * 60 * 1000);
		httpFactory.setReadTimeout(30 * 60 * 1000);
		httpFactory.setConnectionRequestTimeout(Integer.MAX_VALUE);
		httpFactory.setHttpClient(httpClient);
		return new RestTemplate(httpFactory);
	}
	
	private String getUrl(String path) {
		String url = apiConfig.getDomain();
		if(path.startsWith("/")) {
			return url + path;
		}
		return url + "/" + path;
	}
	
	private HttpHeaders getHeaders(){
		HttpHeaders apiHeaders = ServiceReferenceContext.getApiHeaders();
		HttpHeaders headers = new HttpHeaders();
		if(apiHeaders != null) {
			return apiHeaders;
		}
		return headers;
	}
	
	public <T> T post(UrlEnum urlEnum, @Nullable Object body, Class<T> responseType, Object... uriVariables) {
		String path = (String) apiConfig.getUrl().get(urlEnum.toString());
		String url = getUrl(path);
		return postSet(url, body, responseType, uriVariables).getBody();
	}
	
	public <T> T post(String path, @Nullable Object body, Class<T> responseType, Object... uriVariables) {
		String url = getUrl(path);
		return postSet(url, body, responseType, uriVariables).getBody();
	}
	
	private <T> ResponseEntity<T> postSet(String url, @Nullable Object body, Class<T> responseType, Object... uriVariables){
		HttpEntity<Object> requestEntity = new HttpEntity<Object>(body, getHeaders());
		return restTemplate.exchange(url, HttpMethod.POST, requestEntity, responseType, uriVariables);
	}

}
