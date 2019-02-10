package com.notatracer.monitoring.messaging;

import java.nio.ByteBuffer;

/**
 *
 */
public class OpeningMessageParser implements MessageParser {

    private SExchangeSummaryMessage exchangeSummaryMsg;
    private SUndSummaryMessage undSummaryMsg;

    @Override
    public void parse(ByteBuffer buf) {
        byte type = buf.get();

        switch(type) {
            case 'E':

        }



    }
}
