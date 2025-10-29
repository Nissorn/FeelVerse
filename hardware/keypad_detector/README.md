# ESP32 Keypad Configuration Detector

## 🎯 Purpose

This tool helps you detect the correct pin configuration for a 4x4 matrix keypad connected to an ESP32. If your keypad isn't responding correctly or buttons are mapped incorrectly, this detector will help you find the proper pin configuration.

## 🔧 Hardware Requirements

- ESP32 Development Board
- 4x4 Matrix Keypad
- USB Cable for programming and serial communication

## 📥 Installation

1. Open `keypad_detector.ino` in Arduino IDE
2. Install the Keypad library if not already installed:
   - Go to **Sketch** → **Include Library** → **Manage Libraries**
   - Search for "Keypad" by Mark Stanley and Alexander Brevig
   - Click **Install**
3. Select your ESP32 board:
   - Go to **Tools** → **Board** → **ESP32 Arduino** → Select your board (e.g., "ESP32 Dev Module")
4. Select the correct COM port:
   - Go to **Tools** → **Port** → Select your ESP32's port
5. Upload the sketch to your ESP32

## 🚀 Usage

### Step 1: Upload and Open Serial Monitor

1. Upload the sketch to your ESP32
2. Open Serial Monitor (**Tools** → **Serial Monitor**)
3. Set baud rate to **115200**
4. You'll see the main menu with 4 detection modes

### Step 2: Choose Detection Mode

```
╔═══════════════════════════════════════════════════════════╗
║ DETECTION MODES:                                         ║
╠═══════════════════════════════════════════════════════════╣
║ 1. Auto-detect configuration (recommended)               ║
║ 2. Test specific pin configuration                       ║
║ 3. Scan all pins for activity                            ║
║ 4. Test current configuration from main code             ║
╚═══════════════════════════════════════════════════════════╝
```

## 📋 Detection Modes Explained

### Mode 1: Auto-detect Configuration (Recommended)

**Best for**: Quick detection when you don't know the pin configuration

**How it works**:
1. Select option `1` in the serial monitor
2. The tool will test several common ESP32 keypad configurations
3. For each configuration, press keys `1, 2, 3, A` (top row) when prompted
4. The tool monitors for 10 seconds per configuration
5. When a working configuration is found, it will display the exact pin mapping to use in your code

**Example output when successful**:
```
✅ Configuration detected successfully!

╔═══════════════════════════════════════════════════════════╗
║ USE THIS CONFIGURATION IN YOUR MAIN CODE:                ║
╚═══════════════════════════════════════════════════════════╝
byte rowPins[ROWS] = {33, 32, 13, 12};
byte colPins[COLS] = {21, 15, 27, 14};
```

### Mode 2: Test Specific Configuration

**Best for**: Testing a known pin configuration or one suggested by your keypad's documentation

**How it works**:
1. Select option `2`
2. Enter row pins when prompted (e.g., `33,32,13,12`)
3. Enter column pins when prompted (e.g., `21,15,27,14`)
4. Press keys on your keypad to test
5. The tool will report how many keys were detected

**Example**:
```
Enter ROW pins (4 pins, separated by commas)
Example: 33,32,13,12
> 33,32,13,12

Enter COLUMN pins (4 pins, separated by commas)
Example: 21,15,27,14
> 21,15,27,14
```

### Mode 3: Scan All Pins for Activity

**Best for**: Finding which ESP32 pins are actually connected to your keypad

**How it works**:
1. Select option `3`
2. The tool monitors common GPIO pins for 15 seconds
3. Press different keys on your keypad
4. Observe which pins show activity (LOW/HIGH changes)
5. Use this information to identify row and column pins

**What to look for**:
- **Row pins**: Change state when pressing ANY key in that row
- **Column pins**: Change state when pressing ANY key in that column
- You should see 4 pins for rows and 4 pins for columns

**Example output**:
```
📍 Pin 33: LOW  (Key press detected!)
📍 Pin 21: LOW  (Key press detected!)
📍 Pin 33: HIGH (Key released)
📍 Pin 21: HIGH (Key released)
```

### Mode 4: Test Current Configuration

**Best for**: Quickly testing if your main code's configuration works

**How it works**:
1. Select option `4`
2. Tests the pin configuration from your main music player code
3. Press keys to verify it's working correctly

## 🔍 Troubleshooting

### Problem: No keys detected in any mode

**Solutions**:
- Check physical connections between ESP32 and keypad
- Verify keypad is getting power (if it has LED indicators)
- Try different GPIO pins (some pins are reserved on ESP32)
- Check for loose wires
- Test keypad with a multimeter to verify it's working

### Problem: Some keys work, others don't

**Solutions**:
- Row/column pins might be in wrong order
- Try Mode 1 (Auto-detect) to find correct order
- Use Mode 3 to identify which pins correspond to which rows/columns
- Check for crossed or swapped wires

### Problem: Wrong keys are detected (e.g., pressing '1' shows '2')

**Solutions**:
- Pin order is incorrect
- Use Mode 1 to auto-detect correct configuration
- Row and column pins might be swapped
- Try reversing the order of row or column pins

### Problem: Keys detected randomly or multiple times

**Solutions**:
- Add debounce delay in main code
- Check for loose connections
- Verify pull-up resistors are working (ESP32 has internal pull-ups)
- Add small capacitors (100nF) across keypad connections

## 📌 Common ESP32 GPIO Pins for Keypads

**Safe to use** (no special functions):
- 12, 13, 14, 15
- 21, 25, 26, 27
- 32, 33

**Avoid using**:
- 0, 2 (boot mode pins)
- 6-11 (connected to flash memory)
- 1, 3 (TX, RX - used for serial)
- 34-39 (input-only, no pull-up)

## 🎵 Integration with Music Player

Once you've found the correct configuration:

1. Copy the detected pin configuration
2. Open your main music player sketch
3. Replace the row and column pin arrays:

```cpp
// Replace these lines with your detected configuration
byte rowPins[ROWS] = {33, 32, 13, 12};  // Your detected row pins
byte colPins[COLS] = {21, 15, 27, 14};  // Your detected column pins
```

4. Upload and test your music player!

## 💡 Tips

- **Start with Mode 1** for fastest detection
- **Use Mode 3** if Mode 1 doesn't find a configuration
- **Document your findings** - write down the working configuration
- **Label your wires** to avoid confusion in future projects
- **Test all 16 keys** before finalizing configuration

## 📝 Example Workflow

1. Upload keypad detector
2. Open Serial Monitor at 115200 baud
3. Select Mode 1 (Auto-detect)
4. Press keys 1, 2, 3, A when prompted
5. Note the detected configuration
6. Update main music player code with detected pins
7. Test music player

## 🐛 Reporting Issues

If the detector doesn't work or you have suggestions:
1. Note your ESP32 board model
2. Note your keypad model (if known)
3. Document which detection mode you tried
4. Include any error messages
5. Describe what happened vs. what you expected

## 📄 License

This tool is part of the FeelVerse project.
