package com.notatracer.monitoring.messaging;

/**
 *
 */
public interface OpeningMonitorMessageListener {
    public void onExchangeSummary(SExchangeSummaryMessage m);
    public void onUndSummary(SUndSummaryMessage m);
}
