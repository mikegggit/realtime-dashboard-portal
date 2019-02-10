package com.notatracer.monitoring.domain;

import java.text.DecimalFormat;
import java.time.Instant;
import java.time.ZoneId;

public class OpeningMonMessage {
	
	private StringBuffer sb = new StringBuffer();
	protected DecimalFormat percentdf = new DecimalFormat("#0.00");
	public OpeningMsgTypes msgType;
	public long timestamp;
	public String timestampString;

	{
		percentdf.setMinimumFractionDigits(2);
		percentdf.setMaximumFractionDigits(2);
	}
	
	public OpeningMonMessage(long timestamp) {
		super();
		this.timestamp = timestamp;
		Instant instant = Instant.ofEpochSecond(this.timestamp);
		this.timestampString = instant.atZone(ZoneId.systemDefault()).toLocalDateTime().toString();
		sb.setLength(0);
	}

	public char getMsgType() {
		return msgType.getCode();
	}

	enum OpeningMsgTypes {
		ExchangeStats('E'), UnderlyingStats('U');

		private char code;

		private OpeningMsgTypes(char code) {
			this.code = code;
		}

		public static OpeningMsgTypes forValue(char code) {
			switch (code) {
			case 'E':
				return ExchangeStats;
			case 'U':
				return UnderlyingStats;
			default:
				throw new IllegalArgumentException(String.format("Unknown exchangeCode [exchangeCode: %s]", code));
			}
		}

		public char getCode() {
			return this.code;
		}
	}

	public long getTimestamp() {
		return timestamp;
	}

	public String getTimestampString() {
		return timestampString;
	}
	
}
