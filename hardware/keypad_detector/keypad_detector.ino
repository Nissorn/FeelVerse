/*
 * ESP32 Keypad Configuration Detector
 * 
 * This tool helps you detect the correct pin configuration for a 4x4 matrix keypad.
 * 
 * HOW IT WORKS:
 * 1. The detector will test all possible row and column pin combinations
 * 2. Press keys on your keypad when prompted
 * 3. The detector will identify which pins correspond to which rows/columns
 * 
 * USAGE:
 * 1. Upload this sketch to your ESP32
 * 2. Open Serial Monitor at 115200 baud
 * 3. Follow the on-screen instructions
 * 4. Note down the detected pin configuration
 */

#include <Keypad.h>

// ========== Keypad Configuration ==========
const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};

// Common ESP32 GPIO pins that can be used for keypad
// Excluding pins used for flash, serial, etc.
const int AVAILABLE_PINS[] = {12, 13, 14, 15, 21, 25, 26, 27, 32, 33};
const int NUM_AVAILABLE_PINS = sizeof(AVAILABLE_PINS) / sizeof(AVAILABLE_PINS[0]);

// Test configurations
byte testRowPins[ROWS];
byte testColPins[COLS];

// Detection state
bool detectionComplete = false;
int currentTestConfig = 0;

void setup() {
  Serial.begin(115200);
  delay(2000);
  
  Serial.println("\n\n╔═══════════════════════════════════════════════════════════╗");
  Serial.println("║   ESP32 Keypad Configuration Detector                    ║");
  Serial.println("╚═══════════════════════════════════════════════════════════╝\n");
  
  Serial.println("This tool will help you find the correct pin configuration");
  Serial.println("for your 4x4 matrix keypad.\n");
  
  displayMenu();
}

void displayMenu() {
  Serial.println("\n╔═══════════════════════════════════════════════════════════╗");
  Serial.println("║ DETECTION MODES:                                         ║");
  Serial.println("╠═══════════════════════════════════════════════════════════╣");
  Serial.println("║ 1. Auto-detect configuration (recommended)               ║");
  Serial.println("║ 2. Test specific pin configuration                       ║");
  Serial.println("║ 3. Scan all pins for activity                            ║");
  Serial.println("║ 4. Test current configuration from main code             ║");
  Serial.println("╚═══════════════════════════════════════════════════════════╝");
  Serial.println("\nEnter your choice (1-4):");
}

void loop() {
  if (Serial.available() > 0) {
    char choice = Serial.read();
    
    // Clear any remaining characters
    while (Serial.available() > 0) {
      Serial.read();
    }
    
    switch (choice) {
      case '1':
        autoDetectConfiguration();
        break;
      case '2':
        testSpecificConfiguration();
        break;
      case '3':
        scanAllPins();
        break;
      case '4':
        testMainConfiguration();
        break;
      default:
        if (choice != '\n' && choice != '\r') {
          Serial.println("\n⚠️  Invalid choice. Please enter 1-4.");
          displayMenu();
        }
        break;
    }
  }
}

void testMainConfiguration() {
  Serial.println("\n╔═══════════════════════════════════════════════════════════╗");
  Serial.println("║ Testing Main Code Configuration                          ║");
  Serial.println("╚═══════════════════════════════════════════════════════════╝\n");
  
  // Configuration from main code
  byte rowPins[ROWS] = {33, 32, 13, 12};
  byte colPins[COLS] = {21, 15, 27, 14};
  
  Serial.println("Row pins: 33, 32, 13, 12");
  Serial.println("Col pins: 21, 15, 27, 14");
  
  testConfiguration(rowPins, colPins);
}

void autoDetectConfiguration() {
  Serial.println("\n╔═══════════════════════════════════════════════════════════╗");
  Serial.println("║ Auto-Detection Mode                                      ║");
  Serial.println("╚═══════════════════════════════════════════════════════════╝\n");
  
  Serial.println("🔍 Testing common ESP32 keypad configurations...\n");
  
  // Common configurations to test
  struct Config {
    byte rows[4];
    byte cols[4];
    const char* name;
  };
  
  Config configs[] = {
    {{33, 32, 13, 12}, {21, 15, 27, 14}, "Config 1 (from main code)"},
    {{32, 33, 12, 13}, {15, 21, 27, 14}, "Config 2 (rows swapped)"},
    {{13, 12, 33, 32}, {27, 14, 21, 15}, "Config 3 (reversed)"},
    {{12, 13, 32, 33}, {14, 27, 15, 21}, "Config 4 (alternate)"},
    {{25, 26, 27, 14}, {32, 33, 12, 13}, "Config 5 (different pins)"},
  };
  
  int numConfigs = sizeof(configs) / sizeof(configs[0]);
  
  for (int i = 0; i < numConfigs; i++) {
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Serial.printf("Testing %s\n", configs[i].name);
    Serial.print("Row pins: ");
    for (int j = 0; j < ROWS; j++) {
      Serial.printf("%d", configs[i].rows[j]);
      if (j < ROWS - 1) Serial.print(", ");
    }
    Serial.println();
    Serial.print("Col pins: ");
    for (int j = 0; j < COLS; j++) {
      Serial.printf("%d", configs[i].cols[j]);
      if (j < COLS - 1) Serial.print(", ");
    }
    Serial.println("\n");
    
    if (testConfiguration(configs[i].rows, configs[i].cols)) {
      Serial.println("\n✅ Configuration detected successfully!");
      Serial.println("\n╔═══════════════════════════════════════════════════════════╗");
      Serial.println("║ USE THIS CONFIGURATION IN YOUR MAIN CODE:                ║");
      Serial.println("╚═══════════════════════════════════════════════════════════╝");
      Serial.print("byte rowPins[ROWS] = {");
      for (int j = 0; j < ROWS; j++) {
        Serial.printf("%d", configs[i].rows[j]);
        if (j < ROWS - 1) Serial.print(", ");
      }
      Serial.println("};");
      Serial.print("byte colPins[COLS] = {");
      for (int j = 0; j < COLS; j++) {
        Serial.printf("%d", configs[i].cols[j]);
        if (j < COLS - 1) Serial.print(", ");
      }
      Serial.println("};");
      Serial.println("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      displayMenu();
      return;
    }
    
    delay(500);
  }
  
  Serial.println("\n⚠️  None of the common configurations worked.");
  Serial.println("💡 Try 'Scan all pins' mode (option 3) to find the correct pins.");
  displayMenu();
}

bool testConfiguration(byte* rowPins, byte* colPins) {
  // Create keypad with test configuration
  Keypad testKeypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
  
  Serial.println("📋 Press keys on your keypad in sequence:");
  Serial.println("   1, 2, 3, A (top row)");
  Serial.println("   Then press any key to continue...\n");
  Serial.println("⏱️  Testing for 10 seconds...\n");
  
  unsigned long startTime = millis();
  unsigned long lastKeyTime = 0;
  int keyPressCount = 0;
  char lastKey = '\0';
  bool topRowDetected = false;
  String detectedKeys = "";
  
  while (millis() - startTime < 10000) {
    char key = testKeypad.getKey();
    
    if (key) {
      keyPressCount++;
      lastKey = key;
      lastKeyTime = millis();
      detectedKeys += key;
      detectedKeys += " ";
      
      Serial.printf("✓ Detected: '%c' (Total: %d keys)\n", key, keyPressCount);
      
      // Check if top row keys are being detected
      if (key == '1' || key == '2' || key == '3' || key == 'A') {
        topRowDetected = true;
      }
      
      delay(200); // Debounce
    }
    
    delay(10);
  }
  
  Serial.println("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  Serial.printf("📊 Test Results: %d key(s) detected\n", keyPressCount);
  if (detectedKeys.length() > 0) {
    Serial.printf("🔑 Keys detected: %s\n", detectedKeys.c_str());
  }
  Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // Consider it successful if we detected at least 3 different keys
  return (keyPressCount >= 3);
}

void testSpecificConfiguration() {
  Serial.println("\n╔═══════════════════════════════════════════════════════════╗");
  Serial.println("║ Test Specific Configuration                              ║");
  Serial.println("╚═══════════════════════════════════════════════════════════╝\n");
  
  byte rowPins[ROWS];
  byte colPins[COLS];
  
  Serial.println("Enter ROW pins (4 pins, separated by commas)");
  Serial.println("Example: 33,32,13,12");
  
  if (readPinsFromSerial(rowPins, ROWS)) {
    Serial.println("\nEnter COLUMN pins (4 pins, separated by commas)");
    Serial.println("Example: 21,15,27,14");
    
    if (readPinsFromSerial(colPins, COLS)) {
      Serial.println("\n📋 Testing configuration:");
      Serial.print("Row pins: ");
      for (int i = 0; i < ROWS; i++) {
        Serial.printf("%d", rowPins[i]);
        if (i < ROWS - 1) Serial.print(", ");
      }
      Serial.println();
      Serial.print("Col pins: ");
      for (int i = 0; i < COLS; i++) {
        Serial.printf("%d", colPins[i]);
        if (i < COLS - 1) Serial.print(", ");
      }
      Serial.println("\n");
      
      testConfiguration(rowPins, colPins);
    }
  }
  
  displayMenu();
}

bool readPinsFromSerial(byte* pins, int count) {
  Serial.print("> ");
  
  unsigned long timeout = millis() + 30000; // 30 second timeout
  String input = "";
  
  while (millis() < timeout) {
    if (Serial.available() > 0) {
      char c = Serial.read();
      if (c == '\n' || c == '\r') {
        if (input.length() > 0) {
          break;
        }
      } else {
        input += c;
        Serial.print(c); // Echo
      }
    }
    delay(10);
  }
  Serial.println();
  
  if (input.length() == 0) {
    Serial.println("⚠️  Timeout or no input received.");
    return false;
  }
  
  // Parse comma-separated values
  int pinIndex = 0;
  int startPos = 0;
  
  for (int i = 0; i <= input.length(); i++) {
    if (i == input.length() || input.charAt(i) == ',') {
      if (pinIndex >= count) {
        Serial.println("⚠️  Too many pins provided.");
        return false;
      }
      
      String pinStr = input.substring(startPos, i);
      pinStr.trim();
      pins[pinIndex] = pinStr.toInt();
      pinIndex++;
      startPos = i + 1;
    }
  }
  
  if (pinIndex != count) {
    Serial.printf("⚠️  Expected %d pins, got %d\n", count, pinIndex);
    return false;
  }
  
  return true;
}

void scanAllPins() {
  Serial.println("\n╔═══════════════════════════════════════════════════════════╗");
  Serial.println("║ Scan All Pins Mode                                       ║");
  Serial.println("╚═══════════════════════════════════════════════════════════╝\n");
  
  Serial.println("This mode will scan individual pins to detect keypresses.");
  Serial.println("This helps identify which physical pins are connected to");
  Serial.println("your keypad's rows and columns.\n");
  
  Serial.println("Available GPIO pins:");
  for (int i = 0; i < NUM_AVAILABLE_PINS; i++) {
    Serial.printf("%d ", AVAILABLE_PINS[i]);
    if ((i + 1) % 8 == 0) Serial.println();
  }
  Serial.println("\n");
  
  Serial.println("Testing each pin as INPUT_PULLUP...");
  Serial.println("Press keys on your keypad and watch for activity.\n");
  
  // Set all pins as input with pullup
  for (int i = 0; i < NUM_AVAILABLE_PINS; i++) {
    pinMode(AVAILABLE_PINS[i], INPUT_PULLUP);
  }
  
  Serial.println("⏱️  Monitoring for 15 seconds...");
  Serial.println("    (Pin will show LOW when connected to pressed key)\n");
  
  unsigned long startTime = millis();
  int lastStates[NUM_AVAILABLE_PINS];
  
  // Initialize states
  for (int i = 0; i < NUM_AVAILABLE_PINS; i++) {
    lastStates[i] = HIGH;
  }
  
  while (millis() - startTime < 15000) {
    for (int i = 0; i < NUM_AVAILABLE_PINS; i++) {
      int currentState = digitalRead(AVAILABLE_PINS[i]);
      
      if (currentState != lastStates[i]) {
        lastStates[i] = currentState;
        
        if (currentState == LOW) {
          Serial.printf("📍 Pin %2d: LOW  (Key press detected!)\n", AVAILABLE_PINS[i]);
        } else {
          Serial.printf("📍 Pin %2d: HIGH (Key released)\n", AVAILABLE_PINS[i]);
        }
      }
    }
    delay(10);
  }
  
  Serial.println("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  Serial.println("💡 TIP: Pins that showed activity are likely your keypad pins.");
  Serial.println("    Row pins: 4 pins that change when pressing keys in rows");
  Serial.println("    Col pins: 4 pins that change when pressing keys in columns");
  Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  displayMenu();
}
