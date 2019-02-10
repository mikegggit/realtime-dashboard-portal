package com.notatracer.monitoring;

import javax.annotation.Resource;

import com.notatracer.monitoring.data.StatsCache;
import com.notatracer.monitoring.domain.ExchangeStats;
import com.notatracer.monitoring.domain.UndStats;
import com.notatracer.monitoring.messaging.*;
import com.notatracer.monitoring.service.ConfigurationService;
import com.notatracer.monitoring.util.messaging.MessagingUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;


import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Stream;

import static com.notatracer.monitoring.util.messaging.MessagingUtils.exchMessage;
import static com.notatracer.monitoring.util.messaging.MessagingUtils.undMessage;

@SpringBootApplication
//@ComponentScan({"com.nasdaq.inet","com.nasdaq.monitoring","options.common.protocols.openingmonitor"})
public class MiddleTierApp implements ApplicationListener<ApplicationReadyEvent> {

	private static Logger LOGGER = Logger.getLogger(MiddleTierApp.class);

	@Resource(name="&openingMonitorListenerFactory")
	private OpeningMonitorListenerFactory openingMonitorListenerFactory;
	
	@Autowired
	private ConfigurationService.Config config;

	@Autowired
	private StatsCache cache;

	public static Random rand = new Random();

	private ExecutorService executor = Executors.newSingleThreadExecutor();


	public static void main(String[] args) {
		LOGGER.info("Main...");
		ConfigurableApplicationContext ctx = SpringApplication.run(MiddleTierApp.class, args);
	}

	@Override
	public void onApplicationEvent(ApplicationReadyEvent event) {
		LOGGER.info("onApplicationEvent...");
		OpeningMonitorListener l = null;
		try {

			l = openingMonitorListenerFactory.getObject();
			executor.execute(streamTask);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	Runnable streamTask = () -> {

		Supplier<? extends SMessage> messageSupplier = () -> {
			if (rand.nextInt() % 10 == 0) {
				return MessagingUtils.generateExchSummaryMessage(exchMessage);
			} else {
				return MessagingUtils.generateUndSummaryMessage(undMessage);
			}
		};

		Stream<? extends SMessage> streamGenerated =
				Stream.generate(messageSupplier);

		streamGenerated
				.map(
						m -> {
							if (m instanceof SExchangeSummaryMessage) {
								SExchangeSummaryMessage em = (SExchangeSummaryMessage) m;
								return new ExchangeStats(m.timestamp, (char) em.exchangeId, (char) em.exchangeState, em.totalOptions,
										em.totalOptionsNotOpen, em.totalUnds, em.totalUndsNotOpen);
							} else {
								return m;
							}
						})
				.map(
						m -> {
							if (m  instanceof SUndSummaryMessage) {
								SUndSummaryMessage um = (SUndSummaryMessage)m;
								return new UndStats(um.timestamp, (char)um.exchangeId, new String(um.undName), (char) um.undState, um.totalOptions,
										um.totalOptionsNotOpen);
							} else {
								return m;
							}
						})
				.forEach(
						m -> {
							try {
								Thread.sleep(25);
								System.out.println(m);
								if (m instanceof ExchangeStats) {
									ExchangeStats stats = (ExchangeStats)m;
									cache.putExchange(stats.getExchangeCode(), stats);
								} else {
									UndStats stats = (UndStats)m;
									cache.putStats(stats.getExchangeCode(), stats);
								}
							} catch (InterruptedException e) {
								e.printStackTrace();
							}
						}
				);

	};

	private void startConnections() {
		LOGGER.info("Starting connections...");

	}

	private void doConnect() {

	}


}