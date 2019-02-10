package com.notatracer.monitoring.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

public class UndStats extends OpeningMonMessage {
	char exchangeCode;
	char state;
	int totalOptions;
	int totalOptionsOpen;
	int totalOptionsNotOpen;
	BigDecimal percentOptionsNotOpen;
	String percentOptionsNotOpenString;
	String name;

	public UndStats(long timestamp, char exchangeCode, String name, char state, int totalOptions, int totalOptionsNotOpen) {
        super(timestamp);

        this.msgType = OpeningMsgTypes.UnderlyingStats;
		this.exchangeCode = exchangeCode;
		this.name = name;
		this.state = state;
		this.totalOptions = totalOptions;
		this.totalOptionsNotOpen = totalOptionsNotOpen;
		this.totalOptionsOpen = this.totalOptions - this.totalOptionsNotOpen;
		try {
			if (this.totalOptions == 0) {
				this.percentOptionsNotOpen = new BigDecimal(0).movePointRight(2);
				this.percentOptionsNotOpenString = percentdf.format(percentOptionsNotOpen) + "%";
			} else {
				this.percentOptionsNotOpen = new BigDecimal((double)this.totalOptionsNotOpen/this.totalOptions).setScale(4, RoundingMode.HALF_DOWN).movePointRight(2);
				this.percentOptionsNotOpenString = percentdf.format(percentOptionsNotOpen) + "%";
			}
		} catch (Throwable t) {
			System.out.println(t);
		}

	}

	public char getExchangeCode() {
		return exchangeCode;
	}

	public String getName() {
		return name;
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
	
	public BigDecimal getPercentOptionsNotOpen() {
		return percentOptionsNotOpen;
	}
	
	public String getPercentOptionsNotOpenString() {
		return percentOptionsNotOpenString;
	}
	
	public int getTotalOptionsOpen() {
		return totalOptionsOpen;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
     * Defines an event contingent on one or more Conditions.
     *
     * @author grudkowm
     *
     */
    public static class Alarm<T extends AlarmThreshold> {
        private String name;
        private List<T> thresholds = new ArrayList<T>();
        public String getName() {
            return name;
        }
        public List<T> getThresholds() {
            return thresholds;
        }

    }

	public static enum AlarmSeverity {
        warning, critical;
    }

	/**
     * Represents a condition associated with an {@link Alarm}.
     * @author grudkowm
     *
     */
    public abstract static class AlarmThreshold {
        protected AlarmSeverity severity;

        public AlarmSeverity getSeverity() {
            return severity;
        }

    }

	public static enum Exchange {

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

	public static enum Level {

        WARN("warn"), CRITICAL("critical");

        private String name;

        private Level(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

	/**
     * Fired in the event a AlarmThreshold is exceeded.
     *
     * @author grudkowm
     *
     */
    @ConfigurationProperties
    @Component
    public static class OpeningAlarm {
        private String name;
        private List<OptionsOpenThreshold> thresholds = new ArrayList<OptionsOpenThreshold>();
        public String getName() {
            return name;
        }
        public List<OptionsOpenThreshold> getThresholds() {
            return thresholds;
        }

    }

	public static class OptionsOpenThreshold {

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
}
