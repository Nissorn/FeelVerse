# ESP32 Music Player Hardware

This directory contains Arduino sketches for the ESP32-based keypad music player hardware component of FeelVerse.

## 📁 Directory Structure

```
hardware/
├── README.md                    # This file
├── keypad_detector/            # Keypad configuration detection tool
│   ├── keypad_detector.ino     # Detection sketch
│   └── README.md               # Detector documentation
└── music_player/               # Main music player application
    └── music_player.ino        # Music player sketch
```

## 🎯 Overview

The hardware component consists of:

1. **Keypad Detector**: A diagnostic tool to identify correct pin configurations for your keypad
2. **Music Player**: The main application that plays musical notes through I2S audio output

## 🔧 Hardware Requirements

### Required Components

- **ESP32 Development Board** (ESP32-WROOM-32 or similar)
- **4x4 Matrix Keypad** (16-button membrane keypad)
- **I2S Audio Module** (e.g., MAX98357A, UDA1334A, or PCM5102)
- **USB Cable** for programming and power
- **Jumper Wires** for connections

### Optional Components

- **Speaker** (if using amplifier module like MAX98357A)
- **3.5mm Audio Jack** (if using DAC module like PCM5102)
- **Breadboard** for prototyping

## 🔌 Wiring Guide

### I2S Audio Module Connections

| I2S Module Pin | ESP32 Pin | Description |
|---------------|-----------|-------------|
| BCLK / BCK    | GPIO 25   | Bit Clock |
| LRC / LRCLK   | GPIO 26   | Left/Right Clock (Word Select) |
| DIN / DATA    | GPIO 16   | I2S Data Out |
| VIN           | 3.3V      | Power |
| GND           | GND       | Ground |

### 4x4 Matrix Keypad Connections

⚠️ **Important**: Keypad pin configuration varies by manufacturer!

**Default Configuration** (test with keypad_detector if it doesn't work):

| Keypad Pin | ESP32 Pin | Type   |
|-----------|-----------|--------|
| Row 1     | GPIO 33   | Row    |
| Row 2     | GPIO 32   | Row    |
| Row 3     | GPIO 13   | Row    |
| Row 4     | GPIO 12   | Row    |
| Col 1     | GPIO 21   | Column |
| Col 2     | GPIO 15   | Column |
| Col 3     | GPIO 27   | Column |
| Col 4     | GPIO 14   | Column |

💡 **Use the keypad_detector sketch to find the correct configuration for your specific keypad!**

## 🚀 Getting Started

### Step 1: Install Arduino IDE and ESP32 Support

1. Download and install [Arduino IDE](https://www.arduino.cc/en/software)
2. Add ESP32 board support:
   - Open Arduino IDE
   - Go to **File** → **Preferences**
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to **Tools** → **Board** → **Boards Manager**
   - Search for "esp32" and install "esp32 by Espressif Systems"

### Step 2: Install Required Libraries

1. **Keypad Library**:
   - Go to **Sketch** → **Include Library** → **Manage Libraries**
   - Search for "Keypad" by Mark Stanley and Alexander Brevig
   - Click **Install**

2. **I2S Driver**: Built into ESP32 Arduino core (no additional installation needed)

### Step 3: Configure Your Keypad

If this is your first time or your keypad doesn't work:

1. Open `hardware/keypad_detector/keypad_detector.ino`
2. Upload to your ESP32
3. Open Serial Monitor at 115200 baud
4. Follow the on-screen instructions to detect your keypad configuration
5. Note the detected pin configuration

### Step 4: Update Music Player Configuration

1. Open `hardware/music_player/music_player.ino`
2. Update the pin configuration with your detected values:
   ```cpp
   byte rowPins[ROWS] = {33, 32, 13, 12};  // Update these
   byte colPins[COLS] = {21, 15, 27, 14};  // Update these
   ```

### Step 5: Upload and Test

1. Select your board: **Tools** → **Board** → **ESP32 Dev Module**
2. Select your port: **Tools** → **Port** → (your ESP32's COM port)
3. Click **Upload**
4. Open Serial Monitor at 115200 baud
5. Test by pressing keys on your keypad

## 🎵 Using the Music Player

### Key Mapping

The keypad keys are mapped to musical notes:

| Key Layout | Note Mapping |
|------------|--------------|
| 1 2 3 A    | C4 D4 E4 F5  |
| 4 5 6 B    | F4 G4 A4 G5  |
| 7 8 9 C    | B4 C5 D5 A5  |
| * 0 # D    | G3 E5 C6 B5  |

### Musical Scale

- **1** = Do (C4, 262 Hz)
- **2** = Re (D4, 294 Hz)
- **3** = Mi (E4, 330 Hz)
- **4** = Fa (F4, 349 Hz)
- **5** = Sol (G4, 392 Hz)
- **6** = La (A4, 440 Hz)
- **7** = Si (B4, 494 Hz)
- **8** = Do (C5, 523 Hz) - High octave
- **9** = Re (D5, 587 Hz) - High octave
- **0** = Mi (E5, 659 Hz) - High octave
- **\*** = Low G (G3, 196 Hz)
- **#** = Very High C (C6, 1047 Hz)

### Playing Notes

1. Press any key to add it to the playback queue
2. Notes play sequentially with 300ms duration each
3. Queue can hold up to 50 notes
4. Notes are played in the order they were pressed

### Example Songs

**Twinkle Twinkle Little Star**:
```
1 1 5 5 6 6 5
4 4 3 3 2 2 1
```

**Mary Had a Little Lamb**:
```
3 2 1 2 3 3 3
2 2 2
3 5 5
```

## 🔍 Troubleshooting

### Keypad Issues

| Problem | Solution |
|---------|----------|
| No keys detected | Run keypad_detector, check wiring |
| Wrong keys detected | Run keypad_detector to find correct pin order |
| Multiple keys from single press | Add debounce delay, check connections |
| Keys stick or repeat | Check for loose wires, add capacitors |

### Audio Issues

| Problem | Solution |
|---------|----------|
| No sound | Check I2S wiring, verify module power |
| Distorted sound | Check sample rate, reduce volume in code |
| Clicking sounds | Already handled with envelope, check connections |
| One channel only | Check LRC/WS connection |

### ESP32 Issues

| Problem | Solution |
|---------|----------|
| Upload fails | Check COM port, press BOOT button during upload |
| Brown-out detector | Use better power supply, add capacitor |
| Resets during operation | Check power supply current capacity |

## ⚙️ Configuration Options

### In `music_player.ino`:

```cpp
#define SAMPLE_RATE 16000        // Audio sample rate (Hz)
#define BUFFER_SIZE 128          // Audio buffer size
#define NOTE_DURATION_MS 300     // Note duration (milliseconds)
#define QUEUE_SIZE 50            // Max notes in queue
```

### Customization Ideas

- Change note durations for faster/slower playback
- Modify frequency mapping for different scales
- Add more notes or octaves
- Implement chords (multiple frequencies)
- Add volume control
- Add special effects (vibrato, tremolo)

## 📊 Pin Usage Summary

### Reserved Pins (Do Not Use)

- **GPIO 0**: Boot mode, pull-up required
- **GPIO 2**: Boot mode, onboard LED
- **GPIO 6-11**: Connected to flash memory
- **GPIO 1, 3**: Serial TX/RX
- **GPIO 34-39**: Input only (no pull-up)

### Used Pins in This Project

- **I2S**: GPIO 16, 25, 26
- **Keypad Rows**: GPIO 12, 13, 32, 33 (default)
- **Keypad Cols**: GPIO 14, 15, 21, 27 (default)

### Available for Expansion

- GPIO 4, 5, 17, 18, 19, 22, 23

## 🔄 Integration with FeelVerse Web App

The music player hardware can be integrated with the FeelVerse web application:

1. **MIDI over Serial**: Send note data via serial port
2. **Bluetooth**: Use ESP32's built-in Bluetooth
3. **WiFi**: Connect to web app via HTTP/WebSocket
4. **USB MIDI**: Implement USB MIDI device class

(Implementation details to be added in future updates)

## 📚 Additional Resources

- [ESP32 Arduino Core Documentation](https://docs.espressif.com/projects/arduino-esp32/)
- [ESP32 I2S API Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/i2s.html)
- [Keypad Library Documentation](https://playground.arduino.cc/Code/Keypad/)
- [I2S Audio Tutorial](https://diyi0t.com/i2s-sound-tutorial-for-esp32/)

## 🤝 Contributing

To contribute to the hardware component:

1. Test changes with real hardware
2. Document pin configurations used
3. Update README if adding new features
4. Include wiring diagrams for new modules
5. Add troubleshooting tips for common issues

## 📝 License

This project is part of the FeelVerse repository.

## ✨ Credits

Developed as part of the FeelVerse project by:
- Nissorn (นาย นิสสรณ์ โกระวิโยธิน)
- And team members

---

**Happy Music Making! 🎵**
