package com.nasdaq.monitoring.mt;

public class OptionsOpenThreshold {

	private short minutesPastOpen;
	private short threshold;
	protected AlarmSeverity severity;

	public OptionsOpenThreshold() {
		super();
	}

	public OptionsOpenThreshold(short minutesPastOpen, AlarmSeverity severity, short threshold) {
		super();
		this.minutesPastOpen = minutesPastOpen;
		this.severity = severity;
		this.threshold = threshold;
	}

	public short getMinutesPastOpen() {
		return minutesPastOpen;
	}

	public short getThreshold() {
		return threshold;
	}
	public AlarmSeverity getSeverity() {
		return severity;
	}
	

}
