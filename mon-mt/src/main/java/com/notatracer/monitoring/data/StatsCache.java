package com.notatracer.monitoring.data;

import java.util.HashMap;
import java.util.Map;

import com.notatracer.monitoring.domain.ExchangeStats;
import com.notatracer.monitoring.domain.UndStats;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

@Component
public class StatsCache {

	private static Logger LOGGER = Logger.getLogger(StatsCache.class);
	

	private Map<Character, ExchangeStats> exchStatsMap = new HashMap<>();
	private Map<Character, Map<String, UndStats>> undStatsMap = new HashMap<>();

	public StatsCache() {
		super();
		LOGGER.info("StatsCache...");
	}

	public void putExchange(char exchangeCode, ExchangeStats stats) {
		LOGGER.debug(String.format("Putting exchange stats [exchange=%s, stats=%s]", exchangeCode, stats));
		exchStatsMap.put(exchangeCode, stats);
	}

	public void putStats(char exchangeCode, UndStats stats) {
		if (!undStatsMap.containsKey(exchangeCode)) {
			undStatsMap.put(exchangeCode, new HashMap<String, UndStats>());
		}
		
		LOGGER.debug(String.format("Putting und stats [exchange=%s, stats=%s]", exchangeCode, stats));
		undStatsMap.get(exchangeCode).put(new String(stats.getName()), stats);	
	}

	public Map<Character, ExchangeStats> getExchangeStats() {
		return exchStatsMap;
	}

	public Map<Character, Map<String, UndStats>> getUndStats() {
		return undStatsMap;
	}

	public Map<String, UndStats> getUndStats(Character exchange) {
		return undStatsMap.get(exchange);
		
	}
	
}
