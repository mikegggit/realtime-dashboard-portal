package com.notatracer.monitoring.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class ExchangeStats extends OpeningMonMessage {

	char exchange;
	char state;
	int totalOptions;
	int totalOptionsOpen;
	int totalOptionsNotOpen;
	BigDecimal percentOptionsNotOpen;
	String percentOptionsNotOpenString;
	BigDecimal percentOptionsOpen;
	String percentOptionsOpenString;

	int totalUnds;
	int totalUndsOpen;
	int totalUndsNotOpen;
	String percentUndsOpenString;
	String percentUndsNotOpenString;

	BigDecimal percentUndsOpen;
	BigDecimal percentUndsNotOpen;

	public ExchangeStats(long timestamp, char exchangeCode, char state, int totalOptions, int totalOptionsNotOpen, int totalUnds, int totalUndsNotOpen) {
		super(timestamp);
		this.msgType = OpeningMsgTypes.ExchangeStats;
		this.exchange = exchangeCode;
		this.state = state;
		this.totalOptions = totalOptions;
		this.totalOptionsOpen = totalOptions - totalOptionsNotOpen;
		this.totalOptionsNotOpen = totalOptionsNotOpen;
		this.totalUnds = totalUnds;
		this.totalUndsOpen = totalUnds - totalUndsNotOpen;
		this.totalUndsNotOpen = totalUndsNotOpen;
		if (this.totalUnds == 0) {
			this.percentUndsOpen = BigDecimal.ZERO.movePointRight(2);
			this.percentUndsNotOpen = BigDecimal.ZERO.movePointRight(2);
			percentUndsOpenString = percentdf.format(this.percentUndsOpen) + "%";
			percentUndsNotOpenString = percentdf.format(this.percentUndsNotOpen) + "%";
		} else {
			this.percentUndsOpen = new BigDecimal((double)(this.totalUndsOpen)/this.totalUnds).setScale(4, RoundingMode.HALF_DOWN).movePointRight(2);
			this.percentUndsNotOpen = new BigDecimal((double)this.totalUndsNotOpen/this.totalUnds).setScale(4, RoundingMode.HALF_DOWN).movePointRight(2);
			this.percentUndsOpenString = percentdf.format(this.percentUndsOpen) + "%";
			this.percentUndsNotOpenString = percentdf.format(this.percentUndsNotOpen) + "%";
		}
		this.percentOptionsOpen = this.totalOptions == 0 ? BigDecimal.ZERO.movePointRight(2) : new BigDecimal((double) this.totalOptionsOpen/this.totalOptions).setScale(4, RoundingMode.HALF_DOWN).movePointRight(2);
		this.percentOptionsNotOpen = this.totalOptions == 0 ? BigDecimal.ZERO.movePointRight(2) : new BigDecimal((double) this.totalOptionsNotOpen/this.totalOptions).setScale(4, RoundingMode.HALF_DOWN).movePointRight(2);
		this.percentOptionsOpenString = percentdf.format(percentOptionsOpen) + "%";
		this.percentOptionsNotOpenString = percentdf.format(percentOptionsNotOpen) + "%";
		
		System.out.println("EXCHANGE:" + percentOptionsNotOpenString);
	}
	
	public char getExchangeCode() {
		return exchange;
	}

	public char getState() {
		return state;
	}

	public int getTotalOptions() {
		return totalOptions;
	}

	public int getTotalOptionsNotOpen() {
		return totalOptionsNotOpen;
	}

	public int getTotalUndsNotOpen() {
		return totalUndsNotOpen;
	}

	public int getTotalOptionsOpen() {
		return totalOptionsOpen;
	}

	public int getTotalUndsOpen() {
		return totalUndsOpen;
	}
	
	public int getTotalUnds() {
		return totalUnds;
	}

	public String getPercentUndsOpenString() {
		return percentUndsOpenString;
	}

	public String getPercentUndsNotOpenString() {
		return percentUndsNotOpenString;
	}

	public String getPercentOptionsOpenString() {
		return percentOptionsOpenString;
	}

	public String getPercentOptionsNotOpenString() {
		return percentOptionsNotOpenString;
	}

	public BigDecimal getPercentUndsOpen() {
		return percentUndsOpen;
	}

	public BigDecimal getPercentUndsNotOpen() {
		return percentUndsNotOpen;
	}

	public BigDecimal getPercentOptionsOpen() {
		return percentOptionsOpen;
	}

	public BigDecimal getPercentOptionsNotOpen() {
		return percentOptionsNotOpen;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
	
}
