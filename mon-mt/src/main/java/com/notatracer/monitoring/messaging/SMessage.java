package com.notatracer.monitoring.messaging;

import java.nio.ByteBuffer;

/**
 *
 */
public class SMessage {

    public static final byte EMPTY_BYTE = '?';
    public static final int EMPTY_INT = -1;


    public byte msgType = EMPTY_BYTE;
    public long timestamp = EMPTY_INT;

    public void clear() {
        this.timestamp  = EMPTY_INT;
        this.msgType = EMPTY_BYTE;
    }

    public void encode(ByteBuffer buf) {
        buf.put(msgType);
        buf.putLong(this.timestamp);
    }

    public void parse(ByteBuffer buf) {
        this.msgType = buf.get();
        this.timestamp = buf.getLong();
    }

    @Override
    public String toString() {
        return "SMessage{" +
                "msgType=" + msgType +
                ", timestamp=" + timestamp +
                '}';
    }

    public enum Lengths {
        UND(5);

        int size = EMPTY_INT;

        Lengths(int size) {
            this.size = size;
        }

        public int getSize() {
            return size;
        }
    }
//    byte exchangeCode;
//    byte exchangeState;
//    byte[] undName = new byte[10];
//    byte undState;
//    int totalOptions;
//    int totalOptionsNotOpen;
//    int totalUnds;
//    int totalUndsNotOpen;

    /*

       <enum class="OptionState" type="byte">
			<enumitem name="PreOpen"   value="P" />
			<enumitem name="Open"      value="O" />
			<enumitem name="Halted"    value="H" />
			<enumitem name="Close"     value="C" />
		</enum>
		        <enum class="ExchangeState" type="byte">
			<enumitem name="PreOpen"        value="P" />
			<enumitem name="Open"           value="O" />
			<enumitem name="Close"          value="C" />
		</enum>
    		<enum class="Tags" type="tinyint">
			<enumitem name="None"                 value="auto" />
			<enumitem name="ExchangeId"           value="auto" />
			<enumitem name="ExchangeState"        value="auto" />
			<enumitem name="TotalOptions"         value="auto" />
			<enumitem name="TotalOptionsNotOpen"  value="auto" />
			<enumitem name="TotalUndNotOpen"      value="auto" />
			<enumitem name="UndName"              value="auto" />
			<enumitem name="UndState"             value="auto" />
			<enumitem name="TotalUnderlyings"     value="auto" />
		</enum>
     */
//
//    protected ByteBuffer buf = null;
//
//    public ByteBuffer getBuf() {
//        return buf;
//    }
//
//    public void setBuf(ByteBuffer buf) {
//        this.buf = buf;
//    }
}
