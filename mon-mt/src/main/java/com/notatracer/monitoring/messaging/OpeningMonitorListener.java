package com.notatracer.monitoring.messaging;

import java.time.LocalTime;

import com.notatracer.monitoring.data.StatsCache;
import com.notatracer.monitoring.domain.ExchangeStats;
import com.notatracer.monitoring.domain.UndStats;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OpeningMonitorListener implements OpeningMonitorMessageListener {

	private Logger LOGGER = Logger.getLogger(OpeningMonitorListener.class);

	@Autowired
	private StatsCache cache;
	
	public OpeningMonitorListener() {
		super();
		LOGGER.info("Creating OpeningMonitorListener.");
	}

	@Override
	public void onExchangeSummary(SExchangeSummaryMessage m) {
		LOGGER.debug("onExchangeSummary");

//		long timestamp = getTimestamp();

		ExchangeStats stats = new ExchangeStats(m.timestamp, (char)m.exchangeId, (char) m.exchangeState, m.totalOptions,
				m.totalOptionsNotOpen, m.totalUnds, m.totalUndsNotOpen);
		cache.putExchange((char)m.exchangeId, stats);

		if (LOGGER.isDebugEnabled()) {
			LOGGER.debug(String.format(
					"onExchSummary [timestamp=%s, exchangeId=%c, totalOptions=%d, totalOptionsNotOpen=%d, totalUnds=%d, totalUndsNotOpen=%d, exchangeState=%c]",
					stats.getTimestamp(), stats.getExchangeCode(), stats.getTotalOptions(), stats.getTotalOptionsNotOpen(), stats.getTotalUnds(),
					stats.getTotalUndsNotOpen(), stats.getState()));
		}
		
		cache.putExchange(stats.getExchangeCode(), stats);
	}

	private long getTimestamp() {
		return LocalTime.now().toNanoOfDay();
	}

	@Override
	public void onUndSummary(SUndSummaryMessage m) {
		LOGGER.debug("onUndSummary");

//	    long timestamp = getTimestamp();


		UndStats stats = new UndStats(m.timestamp, (char)m.exchangeId, new String(m.undName), (char) m.undState, m.totalOptions,
				m.totalOptionsNotOpen);

		if (LOGGER.isDebugEnabled()) {
			LOGGER.debug(String.format(
					"onUndSummary [timestamp=%s, marketId=%c, undName=%s, totOptions=%d, totOptionsNotOpen=%d, undState=%c]",
					stats.timestamp, stats.getExchangeCode(), stats.getTotalOptions(), stats.getTotalOptionsNotOpen(),
					stats.getState()));
		}
		
		cache.putStats(stats.getExchangeCode(), stats);
	}

}
