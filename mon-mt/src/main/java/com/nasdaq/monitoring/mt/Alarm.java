package com.nasdaq.monitoring.mt;

import java.util.ArrayList;
import java.util.List;

/**
 * Defines an event contingent on one or more Conditions.
 * 
 * @author grudkowm
 *
 */
public class Alarm<T extends AlarmThreshold> {
	private String name;
	private List<T> thresholds = new ArrayList<T>();
	public String getName() {
		return name;
	}
	public List<T> getThresholds() {
		return thresholds;
	}
	
}
