package com.notatracer.monitoring.messaging;

import java.nio.ByteBuffer;

/**
 *
 */
public class SExchangeSummaryMessage extends SMessage {

    public SExchangeSummaryMessage() {
        msgType = (byte)'E';
    }

    public byte exchangeId;
    public byte exchangeState;
    public int totalOptions;
    public int totalOptionsNotOpen;
    public int totalUnds;
    public int totalUndsNotOpen;

    @Override
    public void encode(ByteBuffer buf) {
        super.encode(buf);
        buf.put(exchangeId);
        buf.put(exchangeState);
        buf.putInt(totalOptions);
        buf.putInt(totalOptionsNotOpen);
        buf.putInt(totalUnds);
        buf.putInt(totalUndsNotOpen);
    }

    @Override
    public void clear() {
        super.clear();
        byte exchangeId = EMPTY_BYTE;
        byte exchangeState = EMPTY_BYTE;
        int totalOptions = EMPTY_INT;
        int totalOptionsNotOpen = EMPTY_INT;
        int totalUnds = EMPTY_INT;
        int totalUndsNotOpen = EMPTY_INT;
    }

    @Override
    public void parse(ByteBuffer buf) {
        this.timestamp = buf.getLong();
        this.exchangeId = buf.get();
        this.exchangeState = buf.get();
        this.totalOptions = buf.getInt();
        this.totalOptionsNotOpen = buf.getInt();
        this.totalUnds = buf.getInt();
        this.totalUndsNotOpen = buf.getInt();
    }
}
