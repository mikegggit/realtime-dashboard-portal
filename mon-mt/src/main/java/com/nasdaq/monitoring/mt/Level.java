package com.nasdaq.monitoring.mt;

public enum Level {

	WARN("warn"), CRITICAL("critical");
	
	private String name;

	private Level(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
}
