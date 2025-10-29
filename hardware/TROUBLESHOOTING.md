# Troubleshooting Checklist

Quick reference guide for common issues with the ESP32 Keypad Music Player.

## 🔴 Problem: Keypad Not Working at All

### Checklist:
- [ ] All 8 wires connected from keypad to ESP32?
- [ ] Using correct GPIO pins (not 0, 2, 6-11)?
- [ ] Keypad has power (if it requires external power)?
- [ ] No loose connections?
- [ ] Tried running keypad_detector Mode 3 (Scan all pins)?
- [ ] Serial Monitor shows no detected keys?

### Solution Steps:
1. Upload `keypad_detector.ino`
2. Open Serial Monitor (115200 baud)
3. Select Mode 3 (Scan all pins)
4. Press keys and observe which pins show activity
5. Update pin configuration in music_player.ino
6. Re-upload and test

---

## 🟡 Problem: Wrong Keys Detected (e.g., pressing '1' shows '2')

### Checklist:
- [ ] Pin order might be wrong
- [ ] Rows and columns might be swapped
- [ ] Keypad manufacturer uses different pin order

### Solution Steps:
1. Upload `keypad_detector.ino`
2. Select Mode 1 (Auto-detect)
3. Follow prompts to detect correct configuration
4. Copy detected pin configuration
5. Update `music_player.ino` with correct pins
6. Re-upload and test

---

## 🟢 Problem: Some Keys Work, Others Don't

### Checklist:
- [ ] All 8 wires properly connected?
- [ ] Check for crossed or loose wires
- [ ] One or more row/column pins incorrect?

### Solution Steps:
1. Note which keys work and which don't
   - If entire row doesn't work: Check row pin
   - If entire column doesn't work: Check column pin
2. Run keypad_detector Mode 3
3. Identify which pins correspond to working/non-working keys
4. Fix wiring or update configuration

---

## 🔵 Problem: No Sound from I2S Module

### Checklist:
- [ ] I2S module has power (3.3V)?
- [ ] All 3 I2S pins connected (BCLK, LRC, DIN)?
- [ ] Speaker or headphones connected?
- [ ] Serial Monitor shows notes playing?
- [ ] Volume turned up (if module has volume control)?

### Solution Steps:
1. Check Serial Monitor for "Playing: X → Note (XXX Hz)"
2. Verify I2S wiring:
   - BCLK → GPIO 25
   - LRC → GPIO 26
   - DIN → GPIO 16
3. Test I2S module separately with tone generator
4. Check speaker/headphone connection
5. Try different I2S module if available

---

## 🟣 Problem: Clicking or Popping Sounds

### Checklist:
- [ ] Loose connections?
- [ ] Power supply unstable?
- [ ] Ground connection poor?

### Solution:
- Check all connections are secure
- Use capacitors on power lines (100nF ceramic)
- Ensure good ground connection
- Use better power supply

---

## 🟠 Problem: ESP32 Keeps Resetting

### Checklist:
- [ ] Brown-out detector triggered?
- [ ] Power supply insufficient?
- [ ] Using GPIO 0 or 2 (boot pins)?

### Solution:
- Use USB power supply with 1A+ capacity
- Add 100µF capacitor near ESP32 power pins
- Don't use GPIO 0, 2 for keypad
- Check Serial Monitor for reset reason

---

## 🔴 Problem: Keys Repeat Multiple Times

### Checklist:
- [ ] Debouncing issue?
- [ ] Loose connections?
- [ ] Keypad membrane damaged?

### Solution:
1. Add delay after key detection in code
2. Check all wire connections
3. Add 100nF capacitors across keypad connections
4. Increase debounce delay in Keypad library

---

## 🟡 Problem: Upload Fails

### Checklist:
- [ ] Correct COM port selected?
- [ ] ESP32 board selected in Arduino IDE?
- [ ] USB cable supports data (not just power)?
- [ ] ESP32 in upload mode?

### Solution:
1. Hold BOOT button during upload
2. Check Tools → Port is correct
3. Try different USB cable
4. Try different USB port
5. Install/update USB drivers

---

## Quick Diagnostic Commands

### In Arduino IDE Serial Monitor (115200 baud):

#### Test Keypad Detector:
```
1 - Auto-detect configuration
2 - Test specific configuration  
3 - Scan all pins for activity
4 - Test current configuration
```

#### Expected Output When Working:
```
✓ Detected: '1' (Total: 1 keys)
✓ Detected: '2' (Total: 2 keys)
📊 Test Results: 4 key(s) detected
🔑 Keys detected: 1 2 3 A
✅ Configuration detected successfully!
```

#### Expected Output When NOT Working:
```
📊 Test Results: 0 key(s) detected
⚠️  None of the common configurations worked.
💡 Try 'Scan all pins' mode (option 3)
```

---

## Pin Reference Table

### Safe GPIO Pins (OK to use):
```
12, 13, 14, 15
21, 25, 26, 27
32, 33
```

### Avoid These Pins:
```
0, 2    - Boot mode pins
6-11    - Flash memory
1, 3    - Serial TX/RX
34-39   - Input only (no internal pull-up)
```

### Default Pin Configuration:
```
Row Pins: 33, 32, 13, 12
Col Pins: 21, 15, 27, 14
I2S BCLK: 25
I2S LRC:  26
I2S DIN:  16
```

---

## Step-by-Step Problem Solving

### If NOTHING works:
1. Start with keypad_detector.ino
2. Use Mode 3 to verify pins are connected
3. Identify active pins
4. Update configuration
5. Test with Mode 1

### If SOME THINGS work:
1. Note what works vs. what doesn't
2. Use Mode 1 to auto-detect
3. Update configuration
4. Test thoroughly

### If EVERYTHING works BUT sounds bad:
1. Check I2S wiring
2. Verify power supply
3. Check speaker/headphone
4. Try different audio module

---

## Getting Help

### Before Asking for Help, Collect This Info:

1. **Hardware:**
   - ESP32 board model: _______________
   - Keypad model: _______________
   - I2S module model: _______________

2. **What You Tried:**
   - [ ] keypad_detector Mode 1
   - [ ] keypad_detector Mode 2
   - [ ] keypad_detector Mode 3
   - [ ] Checked all wiring
   - [ ] Tried different pins

3. **Symptoms:**
   - What works: _______________
   - What doesn't work: _______________
   - Error messages: _______________

4. **Serial Monitor Output:**
   - Copy/paste relevant output
   - Include any error messages

---

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| No keys detected | Run detector Mode 3 |
| Wrong keys | Run detector Mode 1 |
| No sound | Check I2S wiring |
| Clicking sounds | Check ground connection |
| ESP32 resets | Better power supply |
| Upload fails | Hold BOOT button |
| Some keys work | Check all 8 wires |
| Keys repeat | Add debounce delay |

---

## Success Indicators

You know it's working when:
- ✅ All 16 keys are detected correctly
- ✅ Each key plays the expected note
- ✅ Serial Monitor shows key presses in real time
- ✅ Sound is clear without clicks/pops
- ✅ Queue fills and plays smoothly
- ✅ No unexpected resets

---

**Remember:** Most problems are due to wiring or pin configuration!
Use the keypad_detector tool - it's designed to solve exactly this problem.

For detailed help, see:
- `README.md` - Complete documentation
- `QUICKSTART_TH.md` - Thai quick start
- `WIRING.md` - Wiring diagrams
- `keypad_detector/README.md` - Detector guide
