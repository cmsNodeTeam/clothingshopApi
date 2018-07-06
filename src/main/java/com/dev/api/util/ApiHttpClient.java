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
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ApiHttpClient {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Bean
	public RestTemplate restTemplate() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
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
	
	public <T> T get(String url,Class<T> responseType) {
		return restTemplate.getForObject(url, responseType);
	}

}
