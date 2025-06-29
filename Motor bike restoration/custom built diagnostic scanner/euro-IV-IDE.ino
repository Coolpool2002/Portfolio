/*
  Euro-4 / KWP2000 DIY Scanner
  ---------------------------------
  RX  = D8  (optocoupler collector, inverted)
  TX  = D9  (optocoupler LED via 1 kΩ)
  Baud (ECU) = 10400, inverted
  Baud (USB) = 115200

  Menu:
    r  – read & list DTCs
    c  – clear DTCs (service $14)
    s  – stream live data (PID 0x0C RPM, 0x11 TPS, 0x05 ECT)
    q  – quit streaming
*/

#include <SoftwareSerial.h>

const byte K_RX = 8;               // inverted input
const byte K_TX = 9;               // output via 1 kΩ
SoftwareSerial kline(K_RX, K_TX, true);   // 'true' = inverse logic

// ---------- Helper: fast-init pulse ----------
void fastInit()
{
  pinMode(K_TX, OUTPUT);
  digitalWrite(K_TX, LOW);   // pull K-Line low
  delay(25);
  digitalWrite(K_TX, HIGH);  // release
  delay(25);
}

// ---------- Helper: send a KWP frame ----------
void sendFrame(const byte *data, byte dataLen) {
  byte total = dataLen + 2;           // 2 address bytes
  byte sum   = 0x80 | total;          // start with format byte in checksum

  kline.write(0x80 | total);          // format
  kline.write(0x11);                  // target (ECU)
  sum += 0x11;
  kline.write(0xF1);                  // source (tester)
  sum += 0xF1;

  for (byte i = 0; i < dataLen; i++) {
    kline.write(data[i]);
    sum += data[i];
  }
  kline.write(sum & 0xFF);            // checksum
}


// ---------- Helper: read a frame (blocking, 1 s timeout) ----------
bool readFrame(byte *buf, byte &len)
{
  unsigned long t0 = millis();
  while (!kline.available())
    if (millis() - t0 > 1000) return false;

  byte fmt = kline.read();           // expect 0x80 | length
  len      = fmt & 0x3F;

  byte tgt = kline.read();           // should be 0x11 (tester)
  byte src = kline.read();           // ECU addr (0xF1)

  for (byte i = 0; i < len; i++)
    buf[i] = kline.read();

  byte chk = kline.read();           // we’ll skip checksum verify for brevity
  return true;
}

// ---------- ECU session start ----------
bool startSession()
{
  fastInit();
  kline.begin(10400);

  const byte keyReq[] = { 0x81, 0x12, 0xF1, 0x81 };
  kline.write(keyReq, sizeof(keyReq));

  byte resp[8]; byte len;
  if (!readFrame(resp, len))  return false;   // no answer
  return true;                                // got key bytes – we're in
}

// ---------- Services ----------
void readDTCs()
{
  const byte req[] = { 0x1A, 0x80 };     // service 1A, sub 80 (all DTCs)
  sendFrame(req, sizeof(req));
  byte resp[16]; byte len;
  if (!readFrame(resp, len)) { Serial.println(F("No response.")); return; }

  Serial.print(F("DTC bytes: "));
  for (byte i = 0; i < len; i++) {
    Serial.print(resp[i] < 16 ? F("0") : F(""));
    Serial.print(resp[i], HEX); Serial.write(' ');
  }
  Serial.println();
}

void clearDTCs()
{
  const byte req[] = { 0x14, 0xFF, 0x00, 0x00 };
  sendFrame(req, sizeof(req));
  Serial.println(F("Clear request sent."));
}

void streamPIDs()
{
  Serial.println(F("Streaming… press 'q' to quit."));
  while (true) {
    if (Serial.available() && Serial.read() == 'q') break;

    // PID 0x0C RPM
    const byte rpmReq[] = { 0x21, 0x0C };
    sendFrame(rpmReq, sizeof(rpmReq));
    byte resp[8]; byte len;
    if (readFrame(resp, len) && len >= 2) {
      int rpm = (resp[len - 2] << 8) | resp[len - 1];
      Serial.print(F("RPM: ")); Serial.print(rpm / 4); Serial.print(F("  "));
    }

    // PID 0x11 TPS
    const byte tpsReq[] = { 0x21, 0x11 };
    sendFrame(tpsReq, sizeof(tpsReq));
    if (readFrame(resp, len) && len >= 1) {
      float tps = resp[len - 1] * 100.0 / 255.0;
      Serial.print(F("TPS %: ")); Serial.print(tps, 1); Serial.print(F("  "));
    }

    // PID 0x05 Coolant
    const byte ectReq[] = { 0x21, 0x05 };
    sendFrame(ectReq, sizeof(ectReq));
    if (readFrame(resp, len) && len >= 1) {
      int temp = resp[len - 1] - 40;
      Serial.print(F("ECT: ")); Serial.print(temp); Serial.print(F("°C"));
    }
    Serial.println();
  }
}

// ---------- Setup / Loop ----------
void setup()
{
  Serial.begin(115200);
  Serial.println(F("\n=== Royal Enfield Euro-4 Scanner ==="));
  Serial.println(F("Connecting…"));

  if (startSession())
    Serial.println(F("ECU session started."));
  else
    Serial.println(F("Failed to start session – check wiring / key-on."));

  Serial.println(F("\nMenu:\nr – Read DTCs\nc – Clear DTCs\ns – Stream live data\n"));
}

void loop()
{
  if (!Serial.available()) return;
  char cmd = Serial.read();

  switch (cmd) {
    case 'r': readDTCs(); break;
    case 'c': clearDTCs(); break;
    case 's': streamPIDs(); break;
    default:  Serial.println(F("Unknown command.")); break;
  }
}
