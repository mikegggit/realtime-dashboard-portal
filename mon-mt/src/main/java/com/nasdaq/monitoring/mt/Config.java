package com.nasdaq.monitoring.mt;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties
@Component
public class Config {
	private String version;
	private List<String> urls = new ArrayList<String>();
	private Map<String, OpeningAlarm> alarmByExchange = new HashMap<>();
	public String getVersion() {
		return version;
	}
	public List<String> getUrls() {
		return urls;
	}
	public Map<String, OpeningAlarm> getAlarmByExchange() {
		return alarmByExchange;
	}
	
}
