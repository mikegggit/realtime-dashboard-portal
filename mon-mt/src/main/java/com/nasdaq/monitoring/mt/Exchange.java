package com.nasdaq.monitoring.mt;

public enum Exchange {

	ISE('I', "ISE"), MERCURY('J', "MERCURY");
	
	private char code;
	private String name;

	private Exchange(char code, String name) {
		this.code = code;
		this.name = name;
	}

	public char getCode() {
		return code;
	}

	public String getName() {
		return name;
	}
	
	public static Exchange forValue(char code) {
		switch(code) {
		case 'I':
			return ISE;
		case 'J':
			return MERCURY;
		default:
			throw new IllegalArgumentException("Unknown exchange code [code=" + code + "]");
		}
	}
	
}
