package com.nasdaq.monitoring.mt;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Fired in the event a AlarmThreshold is exceeded.
 * 
 * @author grudkowm
 *
 */
@ConfigurationProperties
@Component
public class OpeningAlarm {
	private String name;
	private List<OptionsOpenThreshold> thresholds = new ArrayList<OptionsOpenThreshold>();
	public String getName() {
		return name;
	}
	public List<OptionsOpenThreshold> getThresholds() {
		return thresholds;
	}
	
}

