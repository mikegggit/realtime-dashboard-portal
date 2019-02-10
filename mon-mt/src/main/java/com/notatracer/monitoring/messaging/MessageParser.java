package com.notatracer.monitoring.messaging;

import java.nio.ByteBuffer;

/**
 * Parses a raw data packet received from the frame.
 */
public interface MessageParser {
    public void parse(ByteBuffer buf);
}
