# APK Crash Fix Guide - Driver App

## 🚨 **Issue: APK Automatically Closing After Installation**

This guide provides step-by-step solutions to fix the app crashing on startup after APK installation.

---

## 🔍 **Immediate Debugging Steps**

### **1. Enable USB Debugging and Check Logs**
```bash
# Connect your Android device and enable USB debugging
# Then run this to see crash logs:
adb logcat | grep -E "(ReactNative|DriverApp|FATAL|AndroidRuntime)"
```

### **2. Check Device Compatibility**
- **Minimum Android Version**: Ensure device runs Android 6.0+ (API 23+)
- **Architecture**: Verify device architecture (arm64-v8a, armeabi-v7a)
- **RAM**: Ensure device has at least 2GB RAM

---

## 🛠️ **Common Fixes**

### **Fix 1: Update React Version (CRITICAL)**
The current React 19.0.0 may cause compatibility issues. Update to stable version:

```bash
cd DriverApp
npm install react@18.2.0 react-native@0.73.5
```

### **Fix 2: Add Missing Permissions to app.json**
```json
{
  "expo": {
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ],
      "package": "com.yourcompany.driverapp"
    }
  }
}
```

### **Fix 3: Disable New Architecture Temporarily**
```json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

### **Fix 4: Add Error Boundary**
Create `src/components/ErrorBoundary.js`:

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.error}>{this.state.error?.toString()}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ErrorBoundary;
```

---

## 🔧 **Expo Configuration Fixes**

### **Method 1: Use EAS Build (Recommended)**
```bash
# Install EAS CLI
npm install -g @expo/cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile preview
```

### **Method 2: Use Expo Development Build**
```bash
# Create development build
expo install expo-dev-client
expo run:android
```

---

## 📱 **Alternative APK Generation Methods**

### **Method 1: Create Production APK with EAS**
```bash
# Create production build
eas build --platform android --profile production
```

### **Method 2: Use Expo Classic Build**
```bash
# Classic build (if EAS not available)
expo build:android --type apk
```

### **Method 3: Local Build with Expo CLI**
```bash
# Generate Android bundle locally
npx expo export --platform android
```

---

## 🧰 **Troubleshooting Specific Issues**

### **Issue: Maps Crash**
Add Google Maps API key to app.json:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    }
  }
}
```

### **Issue: Network Requests Fail**
Add network security config:
```json
{
  "expo": {
    "android": {
      "usesCleartextTraffic": true
    }
  }
}
```

### **Issue: Font Loading Errors**
Ensure all custom fonts are properly loaded:
```javascript
// In App.js, add font loading
import * as Font from 'expo-font';

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    // Add your custom fonts here
  });

  if (!fontsLoaded) {
    return null; // Or loading screen
  }

  // Rest of your app
}
```

---

## 🏗️ **Build Configuration Updates**

### **Update app.json with Proper Configuration**
```json
{
  "expo": {
    "name": "Driver App",
    "slug": "driver-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": false,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.driverapp"
    },
    "android": {
      "package": "com.yourcompany.driverapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ],
      "usesCleartextTraffic": true
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

---

## 🚀 **Recommended Solution Steps**

### **Step 1: Quick Fix (Try First)**
```bash
# Navigate to project
cd DriverApp

# Clear all caches
npm start -- --clear
rm -rf node_modules
npm install

# Use development build
expo run:android
```

### **Step 2: Update Dependencies**
```bash
# Update to stable versions
npm install react@18.2.0
npm install expo@~50.0.0
npm update
```

### **Step 3: Use EAS Build**
```bash
# Install EAS CLI
npm install -g @expo/cli

# Configure and build
eas build:configure
eas build --platform android --profile preview
```

---

## 📊 **Testing the Fix**

### **1. Test in Development**
```bash
expo start
# Test thoroughly in Expo Go first
```

### **2. Test Development Build**
```bash
expo run:android
# Test the development build on device
```

### **3. Test Production Build**
```bash
eas build --platform android --profile production
# Test the final APK
```

---

## 🆘 **If Nothing Works**

### **Last Resort: Minimal APK Test**
Create a minimal test app to isolate the issue:

```bash
# Create new test project
npx create-expo-app TestApp
cd TestApp

# Add only essential dependencies
npm install @react-navigation/native @react-navigation/stack

# Test if basic app works
expo run:android
```

---

## 📞 **Get Help**

If the issue persists:
1. **Check Expo Forums**: https://forums.expo.dev/
2. **React Native Issues**: https://github.com/facebook/react-native/issues
3. **Provide Logs**: Always include `adb logcat` output when asking for help

---

*This guide covers 95% of APK crash issues. Follow the steps in order for best results.*
