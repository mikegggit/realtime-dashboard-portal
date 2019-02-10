package com.nasdaq.monitoring.mt;

/**
 * Represents a condition associated with an {@link Alarm}.  
 * @author grudkowm
 *
 */
public abstract class AlarmThreshold {
	protected AlarmSeverity severity;

	public AlarmSeverity getSeverity() {
		return severity;
	}
	
}
