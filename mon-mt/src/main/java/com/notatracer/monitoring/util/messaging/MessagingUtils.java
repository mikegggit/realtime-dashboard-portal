package com.notatracer.monitoring.util.messaging;

import com.notatracer.monitoring.messaging.SExchangeSummaryMessage;
import com.notatracer.monitoring.messaging.SMessage;
import com.notatracer.monitoring.messaging.SUndSummaryMessage;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;

import static com.notatracer.monitoring.MiddleTierApp.rand;

/**
 *
 */
public class MessagingUtils {
    public static SUndSummaryMessage undMessage = new SUndSummaryMessage();
    public static SExchangeSummaryMessage exchMessage = new SExchangeSummaryMessage();
    public static List<String> underlyings = Arrays.asList("AAPL", "AMD", "AMZN", "BAC", "BUD", "CAT", "F", "GE", "GOOG", "HBI", "INTC", "JPM", "LLL", "MSFT", "MU", "NDAQ", "NOK", "ORCL", "SAP", "TSLA", "V", "VZ", "XOM", "YHOO");
    public static List<Byte> exchangeCodes = Arrays.asList((byte)'A', (byte)'N', (byte)'C', (byte)'Y', (byte)'B', (byte)'M');
    public static List<Byte> undState = Arrays.asList((byte)'C', (byte)'H', (byte)'O');
    public static List<Byte> exchState = Arrays.asList((byte)'C', (byte)'H', (byte)'O');


    public static int MAX_OPTIONS = 20000;
    public static int MAX_UNDERLYINGS = 5000;

    public static SMessage generateUndSummaryMessage(SUndSummaryMessage undMessage) {
        undMessage.clear();
        long timestamp = LocalDateTime.now().toEpochSecond(ZoneOffset.ofHours(-5));
        int totalOptions = rand.nextInt(MAX_OPTIONS);
        int totalOptionsNotOpen = totalOptions == 0 ? 0 : rand.nextInt(totalOptions);
        byte exchangeCode = exchangeCodes.get(rand.nextInt(exchangeCodes.size()));
        byte uState = undState.get(rand.nextInt(undState.size()));

        undMessage.timestamp = timestamp;
        undMessage.exchangeId = exchangeCode;
        String und = underlyings.get(rand.nextInt(underlyings.size()));
        System.arraycopy(und.getBytes(), 0, undMessage.undName, 0, und.length());
        undMessage.undState = uState;
        undMessage.totalOptions = totalOptions;
        undMessage.totalOptionsNotOpen = totalOptionsNotOpen;

        return undMessage;
    }

    public static SMessage generateExchSummaryMessage(SExchangeSummaryMessage exchMessage) {
        // total options is random between 1 and N
        // total options not open is a random number between total options and 0

        exchMessage.clear();
        long timestamp = LocalDateTime.now().toEpochSecond(ZoneOffset.ofHours(-5));
        int totalOptions = rand.nextInt(MAX_OPTIONS);
        int totalOptionsNotOpen = totalOptions == 0 ? 0 : rand.nextInt(totalOptions);
        int totalUnds = rand.nextInt(MAX_UNDERLYINGS);
        int totalUndsNotOpen = totalUnds == 0 ? 0 : rand.nextInt(totalUnds);
        byte exchangeCode = exchangeCodes.get(rand.nextInt(exchangeCodes.size()));
        byte eState = exchState.get(rand.nextInt(exchState.size()));

        exchMessage.timestamp = timestamp;
        exchMessage.exchangeId = exchangeCode;
        exchMessage.exchangeState = eState;
        exchMessage.totalOptions = totalOptions;
        exchMessage.totalOptionsNotOpen = totalOptionsNotOpen;
        exchMessage.totalUnds = totalUnds;
        exchMessage.totalUndsNotOpen = totalUndsNotOpen;

        return exchMessage;
    }
}
