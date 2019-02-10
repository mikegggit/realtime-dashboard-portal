package com.notatracer.monitoring.messaging;

import java.nio.ByteBuffer;
import java.util.Arrays;

import static com.notatracer.monitoring.messaging.SMessage.Lengths.*;

/**
 *
 */
public class SUndSummaryMessage extends SMessage {

    public SUndSummaryMessage() {
        msgType = (byte)'U';
    }

    public byte exchangeId;
    public byte undState;
    public byte[] undName = new byte[UND.getSize()];;
    public int totalOptions;
    public int totalOptionsNotOpen;

    @Override
    public void encode(ByteBuffer buf) {
        super.encode(buf);
        buf.put(exchangeId);
        buf.put(undState);
        buf.put(undName);
        buf.putInt(totalOptions);
        buf.putInt(totalOptionsNotOpen);
    }

    @Override
    public void clear() {
        super.clear();
        this.exchangeId = EMPTY_BYTE;
        this.undState = EMPTY_BYTE;
        Arrays.fill(this.undName, (byte)' ');
        this.totalOptions = EMPTY_INT;
        this.totalOptionsNotOpen = EMPTY_INT;
    }

    @Override
    public void parse(ByteBuffer buf) {
        super.parse(buf);
        this.timestamp = buf.getLong();
        this.exchangeId = buf.get();
        buf.get(this.undName);
        this.totalOptions = buf.getInt();
        this.totalOptionsNotOpen = buf.getInt();
    }

    /*
    		"onUndSummary [timestamp=%s, marketId=%s, undName=%s, totOptions=%d, totOptionsNotOpen=%d, undState=%s]",
					timestamp, (char) handler.exchangeCode, undName, handler.totalOptions, handler.totalOptionsNotOpen,
					(char) handler.undState));
		}

		char exchangeCode = (char) handler.exchangeCode;
     */
}
