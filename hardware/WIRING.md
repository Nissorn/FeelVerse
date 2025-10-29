# ESP32 Keypad Music Player - Wiring Diagrams

## Complete System Wiring

```
┌─────────────────────────────────────────────────────────────────┐
│                        ESP32 Board                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   I2S Audio Output:                                    │   │
│  │   GPIO 25 (BCLK) ──────────────────┐                   │   │
│  │   GPIO 26 (LRC)  ──────────────────┼─────┐             │   │
│  │   GPIO 16 (DIN)  ──────────────────┼─────┼───┐         │   │
│  │                                    │     │   │         │   │
│  │   Keypad Row Pins:                 │     │   │         │   │
│  │   GPIO 33 (Row 1) ───┐             │     │   │         │   │
│  │   GPIO 32 (Row 2) ───┼───┐         │     │   │         │   │
│  │   GPIO 13 (Row 3) ───┼───┼───┐     │     │   │         │   │
│  │   GPIO 12 (Row 4) ───┼───┼───┼─┐   │     │   │         │   │
│  │                      │   │   │ │   │     │   │         │   │
│  │   Keypad Column Pins:│   │   │ │   │     │   │         │   │
│  │   GPIO 21 (Col 1) ───┼───┼───┼─┼───┼─┐   │   │         │   │
│  │   GPIO 15 (Col 2) ───┼───┼───┼─┼───┼─┼─┐ │   │         │   │
│  │   GPIO 27 (Col 3) ───┼───┼───┼─┼───┼─┼─┼─┤   │         │   │
│  │   GPIO 14 (Col 4) ───┼───┼───┼─┼───┼─┼─┼─┼─┐ │         │   │
│  │                      │   │   │ │   │ │ │ │ │ │         │   │
│  │   3.3V ──────────────┼───┼───┼─┼───┼─┼─┼─┼─┼─┼───┐     │   │
│  │   GND  ──────────────┼───┼───┼─┼───┼─┼─┼─┼─┼─┼───┼───┐ │   │
│  │                      │   │   │ │   │ │ │ │ │ │   │   │ │   │
│  └──────────────────────┼───┼───┼─┼───┼─┼─┼─┼─┼─┼───┼───┼─┘   │
│                         │   │   │ │   │ │ │ │ │ │   │   │     │
└─────────────────────────┼───┼───┼─┼───┼─┼─┼─┼─┼─┼───┼───┼─────┘
                          │   │   │ │   │ │ │ │ │ │   │   │
       To I2S Module:     │   │   │ │   │ │ │ │ │ │   │   │
                          ↓   ↓   ↓ │   │ │ │ │ │ │   │   │
                       ┌──────────────┐ │ │ │ │ │ │   │   │
                       │ I2S Module   │ │ │ │ │ │ │   │   │
                       │ MAX98357A or │ │ │ │ │ │ │   │   │
                       │ UDA1334A or  │ │ │ │ │ │ │   │   │
                       │ PCM5102      │ │ │ │ │ │ │   │   │
                       │              │ │ │ │ │ │ │   │   │
                       │ BCLK  ←──────┘ │ │ │ │ │ │   │   │
                       │ LRC   ←────────┘ │ │ │ │ │   │   │
                       │ DIN   ←──────────┘ │ │ │ │   │   │
                       │ VIN   ←────────────┼─┘ │ │   │   │
                       │ GND   ←────────────┼───┘ │   │   │
                       └──────────────┘     │     │   │   │
                              │             │     │   │   │
                              ↓             │     │   │   │
                         [Speaker or        │     │   │   │
                          Headphones]       │     │   │   │
                                            │     │   │   │
       To Keypad:                           │     │   │   │
                                            ↓     ↓   ↓   ↓
                       ┌─────────────────────────────────────┐
                       │   4x4 Matrix Keypad                │
                       │                                    │
                       │   ┌───┬───┬───┬───┐               │
                       │   │ 1 │ 2 │ 3 │ A │               │
                       │   ├───┼───┼───┼───┤               │
                       │   │ 4 │ 5 │ 6 │ B │               │
                       │   ├───┼───┼───┼───┤               │
                       │   │ 7 │ 8 │ 9 │ C │               │
                       │   ├───┼───┼───┼───┤               │
                       │   │ * │ 0 │ # │ D │               │
                       │   └───┴───┴───┴───┘               │
                       │                                    │
                       │  Row1 ←──────────────────┘         │
                       │  Row2 ←────────────────┘           │
                       │  Row3 ←──────────────┘             │
                       │  Row4 ←────────────┘               │
                       │  Col1 ←──────────┘                 │
                       │  Col2 ←────────┘                   │
                       │  Col3 ←──────┘                     │
                       │  Col4 ←────┘                       │
                       └─────────────────────────────────────┘
```

## I2S Module Connection Details

### MAX98357A (I2S Amplifier with Speaker Output)

```
ESP32          MAX98357A
─────          ─────────
GPIO 25   →    BCLK
GPIO 26   →    LRC (or WS)
GPIO 16   →    DIN
3.3V      →    VIN
GND       →    GND

MAX98357A      Speaker
─────────      ───────
OUT+      →    Speaker +
OUT-      →    Speaker -
```

### UDA1334A or PCM5102 (I2S DAC with Line/Headphone Output)

```
ESP32          DAC Module
─────          ──────────
GPIO 25   →    BCK (or BCLK)
GPIO 26   →    LRCK (or LRC, WS)
GPIO 16   →    DIN (or DATA)
3.3V      →    VIN
GND       →    GND

DAC Module     Output
──────────     ──────
3.5mm Jack →   Headphones
or
Left       →   Left Channel
Right      →   Right Channel
Ground     →   Ground
```

## 4x4 Keypad Matrix

### Physical Layout

```
     Col1  Col2  Col3  Col4
      │     │     │     │
Row1──┼─────┼─────┼─────┼──── [When button pressed, Row connects to Col]
      │     │     │     │
      1     2     3     A
      │     │     │     │
Row2──┼─────┼─────┼─────┼────
      │     │     │     │
      4     5     6     B
      │     │     │     │
Row3──┼─────┼─────┼─────┼────
      │     │     │     │
      7     8     9     C
      │     │     │     │
Row4──┼─────┼─────┼─────┼────
      │     │     │     │
      *     0     #     D
```

### Pin Identification

```
Keypad Back View (may vary by manufacturer):
┌────────────────────────┐
│  8 pins (could be 4+4) │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┐
│  │  │  │  │  │  │  │  │  │
└──┴──┴──┴──┴──┴──┴──┴──┴──┘
   R1 R2 R3 R4 C1 C2 C3 C4   (typical layout)

⚠️  WARNING: Pin order varies by manufacturer!
    Use the keypad_detector to find your exact configuration.

Common layouts:
1. R1 R2 R3 R4 C1 C2 C3 C4  (most common)
2. R4 R3 R2 R1 C4 C3 C2 C1  (reversed)
3. C1 C2 C3 C4 R1 R2 R3 R4  (columns first)
```

## Breadboard Layout Example

```
                    Breadboard
    ┌────────────────────────────────────────┐
    │                                        │
    │   4x4 Keypad                           │
    │   (8 wires)                            │
    │   │││││││││                            │
    │   ↓↓↓↓↓↓↓↓                             │
    │   ═══════════   ← Connect to ESP32     │
    │                                        │
    │                                        │
    │                                        │
    │   I2S Module                           │
    │   ┌────────┐                           │
    │   │MAX98357│                           │
    │   │ or DAC │                           │
    │   └────┬───┘                           │
    │        │                               │
    │   ═════════════  ← Connect to ESP32    │
    │                                        │
    │   [Speaker] or [Headphones]            │
    │                                        │
    └────────────────────────────────────────┘
```

## Testing Connection Steps

### Step 1: Test I2S Audio First

1. Connect only the I2S module
2. Upload a simple tone generator
3. Verify audio output works
4. ✓ Proceed if audio works

### Step 2: Test Keypad Separately

1. Disconnect I2S (optional, but safer)
2. Connect keypad
3. Upload keypad_detector.ino
4. Verify key detection works
5. ✓ Note down correct pin configuration

### Step 3: Combine Both

1. Connect both I2S and Keypad
2. Update music_player.ino with correct pins
3. Upload and test
4. ✓ Enjoy your music player!

## Common Connection Mistakes

### ❌ Wrong

```
ESP32 GPIO 0  → Keypad  (GPIO 0 is boot pin)
ESP32 GPIO 2  → Keypad  (GPIO 2 is boot pin)
ESP32 GPIO 6-11 → Keypad (Flash memory pins)
```

### ✅ Correct

```
ESP32 GPIO 12-15 → Keypad  (Safe to use)
ESP32 GPIO 21-27 → Keypad  (Safe to use)
ESP32 GPIO 32-33 → Keypad  (Safe to use)
```

## Power Considerations

```
Power Supply Recommendations:

USB Power (5V)
    │
    ├─→ ESP32 (via USB)
    │   Internal regulator → 3.3V
    │
    └─→ I2S Module
        VIN pin (3.3V from ESP32)

For MAX98357A with loud speakers:
- May need external 5V supply
- USB may not provide enough current
- Consider USB power bank or wall adapter

For DAC modules:
- Usually fine with USB power
- Low current consumption
```

## Troubleshooting Wiring

### No Response from Keypad

Check:
1. All 8 wires connected? (4 rows + 4 columns)
2. Wires in correct pins?
3. Loose connections?
4. Using GPIO 6-11? (Don't use these!)

### No Audio Output

Check:
1. I2S module getting power (3.3V)?
2. BCLK, LRC, DIN all connected?
3. Speaker/headphones connected to output?
4. Volume up? (some modules have volume control)

### Random Behavior / Resets

Check:
1. Power supply adequate?
2. Not using boot pins (0, 2)?
3. Good ground connection?
4. Wires too long? (keep < 20cm)

## Tips for Clean Wiring

1. **Use different colored wires:**
   - Red: Power (3.3V)
   - Black: Ground
   - Yellow/Orange: I2S signals
   - Other colors: Keypad

2. **Keep wires organized:**
   - Bundle row pins together
   - Bundle column pins together
   - Separate I2S from keypad

3. **Label your wires:**
   - Use masking tape and marker
   - Write pin numbers on tape
   - Makes debugging easier

4. **Test incrementally:**
   - Connect one component at a time
   - Verify each works before adding next
   - Easier to find problems

## Safety Notes

⚠️ **Important:**
- Never connect 5V directly to ESP32 GPIO pins
- Always use 3.3V logic levels
- Don't short power to ground
- Disconnect power when changing wiring
- Double-check before powering on

---

For more details, see:
- `README.md` - Complete documentation
- `keypad_detector/README.md` - Detector usage
- `QUICKSTART_TH.md` - Thai language quick start
