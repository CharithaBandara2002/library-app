# 📚 Library Hub – Mobile Application
---

## 🌟 Project Overview

**Library Hub** is a cloud-synchronized mobile application designed for university students to reserve library books and book reading-room study seats in real time. 

---

## 🛠️ Technology Stack & Justification

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Mobile Frontend** | **React Native (Expo SDK 57)** | Cross-platform compatibility (iOS & Android) with native performance, responsive flexbox layout, and rapid iterative UI development. |
| **Cloud Backend / DB** | **Google Cloud Firestore (Firebase SDK)** | Real-time multi-device synchronization, offline cache persistence, and ACID document compliance. Changes on one device (seat reservation, copy decrement) update globally in real time. |
| **Media / Photos** | **`expo-image-picker` & Base64 Cloud Storage** | Allows taking live photos or picking gallery images, compressed to lightweight Base64 payloads stored in Cloud Firestore without requiring third-party storage fees. |
| **Local Session** | **AsyncStorage** | Secure on-device active user session persistence across application restarts. |

---


## 🚀 Setup & Run Instructions

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)
* **Expo Go** mobile app installed on your smartphone ([Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [iOS App Store](https://apps.apple.com/app/expo-go/id982107779))

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd library-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npx expo start
```

### 4. Run on Your Device
* **Android / iOS Device:** Open the **Expo Go** app and scan the QR code displayed in the terminal.
* **Android Emulator:** Press `a` in the terminal.
* **iOS Simulator:** Press `i` in the terminal.
* **Web Browser:** Press `w` in the terminal.
* **Reload Bundle:** Press `r` in the terminal.

---

## 📂 Project Structure

```
library-app/
├── assets/                  # Icons, splash images, and visual assets
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js  # Root stack & 5-tab bottom navigation
│   ├── screens/
│   │   ├── OnboardingScreen.js           
│   │   ├── LoginScreen.js                
│   │   ├── RegisterScreen.js            
│   │   ├── HomeScreen.js                  
│   │   ├── BookSearchScreen.js           
│   │   ├── BookDetailsScreen.js       
│   │   ├── ReservationConfirmationScreen.js
│   │   ├── SeatBookingScreen.js          
│   │   ├── MyReservationsScreen.js   
│   │   ├── ProfileScreen.js      
│   │   └── NotificationsScreen.js
│   ├── services/
│   │   ├── firebase.js      # Firebase & Firestore initialization
│   │   ├── database.js     
│   │   └── cloudSync.js     # Image picker & Base64 cloud uploader
│   └── theme/
│       └── colors.js        # Royal Blue (#1A56DB) design tokens
├── App.js                   # Root entry point
├── app.json                 # Expo project configuration
└── package.json             # Dependencies & scripts
```