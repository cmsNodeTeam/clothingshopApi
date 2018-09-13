package com.dev.api.util;

import java.text.FieldPosition;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@SuppressWarnings("serial")
public class JsonUtils {
	private static final ObjectMapper mapper = new ObjectMapper();
	public static final String TIME_ZONE = "GTM+8";
	static {
		mapper.setSerializationInclusion(Include.NON_NULL);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, true);
		mapper.configure(SerializationFeature.FAIL_ON_SELF_REFERENCES, false);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.setDateFormat(new SimpleDateFormat() {
			@Override
			public StringBuffer format(Date date, StringBuffer toAppendTo, FieldPosition pos) {
				return localFormat(date, toAppendTo, pos);
			}

			public synchronized StringBuffer localFormat(Date date, StringBuffer toAppendTo, FieldPosition pos) {
				return super.format(date, toAppendTo, pos);
			}
		});
		mapper.setTimeZone(TimeZone.getDefault());
		mapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
		mapper.setVisibility(PropertyAccessor.GETTER, Visibility.NONE);
		mapper.setVisibility(PropertyAccessor.SETTER, Visibility.NONE);
	}

	public static ObjectMapper getMapper() {
		return mapper;
	}
}
