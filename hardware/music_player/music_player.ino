#include <driver/i2s.h>
#include <Keypad.h>

// ========== I2S Pin Configuration ==========
#define BCLK_PIN 25      // Bit Clock
#define LRC_PIN 26       // Left/Right Clock (Word Select)
#define DIN_PIN 16       // I2S Data Out

// ========== I2S Settings ==========
#define SAMPLE_RATE 16000
#define BUFFER_SIZE 128
#define NOTE_DURATION_MS 300  // ระยะเวลาเล่นแต่ละโน้ต (มิลลิวินาที)

// ========== Keypad Configuration ==========
// 🔧 IMPORTANT: If your keypad doesn't work correctly, use the keypad_detector
// sketch to find the correct pin configuration for your hardware
const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};

// Configure these pins based on your hardware
// Use the keypad_detector tool if these don't work
byte rowPins[ROWS] = {33, 32, 13, 12};
byte colPins[COLS] = {21, 15, 27, 14};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

// ========== Audio Buffer ==========
int16_t audioBuffer[BUFFER_SIZE];

// ========== Queue System ==========
#define QUEUE_SIZE 50
char noteQueue[QUEUE_SIZE];
int queueHead = 0;  // ตำแหน่งที่จะเพิ่มข้อมูล
int queueTail = 0;  // ตำแหน่งที่จะอ่านข้อมูล
int queueCount = 0; // จำนวนโน้ตในคิว

// ========== Playback State ==========
bool isPlaying = false;
int currentFrequency = 0;
unsigned long sampleCounter = 0;
unsigned long noteStartTime = 0;
char lastKeyState[16] = {0};  // เก็บสถานะปุ่มที่กดไว้

// ========== Note Frequency Mapping ==========
struct NoteMapping {
  char key;
  int frequency;
  const char* noteName;
};

NoteMapping noteMap[] = {
  {'1', 262, "C4"},   // Do
  {'2', 294, "D4"},   // Re
  {'3', 330, "E4"},   // Mi
  {'4', 349, "F4"},   // Fa
  {'5', 392, "G4"},   // Sol
  {'6', 440, "A4"},   // La
  {'7', 494, "B4"},   // Si
  {'8', 523, "C5"},   // Do (high)
  {'9', 587, "D5"},   // Re (high)
  {'0', 659, "E5"},   // Mi (high)
  {'A', 698, "F5"},   // Fa (high)
  {'B', 784, "G5"},   // Sol (high)
  {'C', 880, "A5"},   // La (high)
  {'D', 988, "B5"},   // Si (high)
  {'*', 196, "G3"},   // Low G
  {'#', 1047, "C6"}   // Very high C
};

const int NUM_NOTES = sizeof(noteMap) / sizeof(noteMap[0]);

// ========== Queue Functions ==========
bool addToQueue(char key) {
  if (queueCount >= QUEUE_SIZE) {
    Serial.println("⚠️  Queue is full!");
    return false;
  }
  
  noteQueue[queueHead] = key;
  queueHead = (queueHead + 1) % QUEUE_SIZE;
  queueCount++;
  
  Serial.printf("➕ Added to queue: %c → %s (Queue size: %d)\n", 
                key, getNoteName(key), queueCount);
  return true;
}

char getFromQueue() {
  if (queueCount == 0) {
    return '\0';
  }
  
  char key = noteQueue[queueTail];
  queueTail = (queueTail + 1) % QUEUE_SIZE;
  queueCount--;
  
  return key;
}

bool isQueueEmpty() {
  return queueCount == 0;
}

void clearQueue() {
  queueHead = 0;
  queueTail = 0;
  queueCount = 0;
}

// ========== Helper Functions ==========
int getFrequency(char key) {
  for (int i = 0; i < NUM_NOTES; i++) {
    if (noteMap[i].key == key) {
      return noteMap[i].frequency;
    }
  }
  return 0;
}

const char* getNoteName(char key) {
  for (int i = 0; i < NUM_NOTES; i++) {
    if (noteMap[i].key == key) {
      return noteMap[i].noteName;
    }
  }
  return "Unknown";
}

// ========== Setup ==========
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("🎵 ESP32 Keypad Music Player (Queue Mode) 🎵");
  Serial.println("==========================================");
  
  // Configure I2S
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = BUFFER_SIZE,
    .use_apll = false,
    .tx_desc_auto_clear = true  // Auto clear to prevent sound hanging
  };
  
  // Configure pins
  i2s_pin_config_t pin_config = {
    .bck_io_num = BCLK_PIN,
    .ws_io_num = LRC_PIN,
    .data_out_num = DIN_PIN,
    .data_in_num = I2S_PIN_NO_CHANGE,
  };
  
  // Install and configure I2S
  esp_err_t err = i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
  if (err != ESP_OK) {
    Serial.printf("❌ i2s_driver_install failed: %d\n", err);
    return;
  }
  
  err = i2s_set_pin(I2S_NUM_0, &pin_config);
  if (err != ESP_OK) {
    Serial.printf("❌ i2s_set_pin failed: %d\n", err);
    return;
  }
  
  // Clear I2S buffer
  i2s_zero_dma_buffer(I2S_NUM_0);
  
  Serial.println("✅ I2S configured successfully!");
  Serial.println("✅ Keypad ready!");
  Serial.printf("🎹 Note duration: %d ms\n", NOTE_DURATION_MS);
  Serial.println("\n📝 Press keys to add notes to queue");
  Serial.println("   Notes will play in sequence");
  Serial.println("\n💡 TIP: If keypad doesn't work, use keypad_detector sketch");
  Serial.println("   to find the correct pin configuration\n");
}

void startPlayingNote(char key) {
  currentFrequency = getFrequency(key);
  if (currentFrequency > 0) {
    isPlaying = true;
    sampleCounter = 0;
    noteStartTime = millis();
    Serial.printf("🎵 Playing: %c → %s (%d Hz)\n", 
                  key, getNoteName(key), currentFrequency);
  }
}

void stopPlaying() {
  if (isPlaying) {
    isPlaying = false;
    currentFrequency = 0;
    sampleCounter = 0;
    
    // Send silence to clear the buffer
    memset(audioBuffer, 0, BUFFER_SIZE * sizeof(int16_t));
    size_t bytesWritten = 0;
    for (int i = 0; i < 3; i++) {  // Send silence multiple times to ensure clear
      i2s_write(I2S_NUM_0, audioBuffer, BUFFER_SIZE * sizeof(int16_t), 
                &bytesWritten, 10);
    }
    i2s_zero_dma_buffer(I2S_NUM_0);  // Clear DMA buffer
    
    Serial.println("⏹️  Stopped");
  }
}

void generateAndPlayTone() {
  // Generate sine wave samples with envelope for smooth sound
  unsigned long elapsed = millis() - noteStartTime;
  float envelope = 1.0;
  
  // Apply fade out at the end to prevent clicking
  if (elapsed > NOTE_DURATION_MS - 50) {
    envelope = (float)(NOTE_DURATION_MS - elapsed) / 50.0;
    envelope = max(0.0f, min(1.0f, envelope));
  }
  
  for (int i = 0; i < BUFFER_SIZE; i++) {
    float angle = 2.0 * PI * currentFrequency * sampleCounter / SAMPLE_RATE;
    audioBuffer[i] = (int16_t)(sin(angle) * 20000 * envelope);
    sampleCounter++;
  }
  
  // Send to I2S
  size_t bytesWritten = 0;
  i2s_write(I2S_NUM_0, audioBuffer, BUFFER_SIZE * sizeof(int16_t), 
            &bytesWritten, portMAX_DELAY);
}

void loop() {
  // ========== Check for new key presses ==========
  char key = keypad.getKey();
  
  if (key) {
    // Key pressed - add to queue
    int freq = getFrequency(key);
    if (freq > 0) {
      addToQueue(key);
    }
  }
  
  // ========== Handle playback ==========
  if (isPlaying) {
    // Check if current note duration is finished
    if (millis() - noteStartTime >= NOTE_DURATION_MS) {
      stopPlaying();
      delay(30);  // Short pause between notes
    } else {
      // Continue playing current note
      generateAndPlayTone();
    }
  } else {
    // Not playing - check if there's a note in queue
    if (!isQueueEmpty()) {
      char nextNote = getFromQueue();
      if (nextNote != '\0') {
        startPlayingNote(nextNote);
      }
    } else {
      // Queue is empty and not playing - ensure silence
      static unsigned long lastSilenceTime = 0;
      if (millis() - lastSilenceTime > 1000) {
        i2s_zero_dma_buffer(I2S_NUM_0);
        lastSilenceTime = millis();
      }
    }
  }
  
  // Small delay to prevent overwhelming the system
  delay(1);
}
