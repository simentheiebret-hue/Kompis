# Kompis - Sosial Aktivitetsapp

En React Native app bygget med Expo for å hjelpe folk med å finne og delta i sosiale aktiviteter.

## 🚀 Komme i gang

### Forutsetninger
- Node.js installert (v14 eller nyere)
- npm eller yarn
- Expo Go-appen på mobilen din

### Installasjon

1. Åpne Terminal og naviger til prosjektmappen:
```bash
cd "/Users/simentheiebretvik/Documents/Kompis PoC 2"
```

2. Installer avhengigheter:
```bash
npm install
```

3. Start utviklingsserveren:
```bash
npx expo start
```

4. Skann QR-koden med:
   - **iOS**: Kamera-appen
   - **Android**: Expo Go-appen

## 📱 Funksjoner

- **Hjem**: Oversikt over kommende aktiviteter og personlige anbefalinger
- **Aktiviteter**: Bla gjennom og bli med på aktiviteter
- **Chat**: Kommuniser med andre deltakere
- **Profil**: Administrer din profil og innstillinger

## 🛠 Teknologi

- React Native
- Expo
- React Navigation
- Expo Linear Gradient
- Expo Vector Icons

## 📝 Prosjektstruktur

```
Kompis PoC 2/
├── App.js              # Hovedfil med navigasjon
├── screens/            # Alle app-skjermer
│   ├── HomeScreen.js
│   ├── ActivitiesScreen.js
│   ├── ChatScreen.js
│   └── ProfileScreen.js
├── assets/            # Bilder og ikoner
├── package.json       # Prosjektavhengigheter
└── app.json          # Expo-konfigurasjon
```

## 🎨 Tilpasning

For å endre farger, rediger fargekodene i hver skjermfil:
- Primærfarge: `#4A90E2` (blå)
- Bakgrunn: `#F5F7FA` (lys grå)

## 📱 Testing

Appen er testet med Expo Go. For å bygge standalone-apper:
```bash
npx expo build:android
npx expo build:ios
```

## ✨ Neste steg

- Legg til backend-integrasjon
- Implementer autentisering
- Koble til database
- Legg til sanntids chat-funksjonalitet
- Publiser til App Store / Google Play

## 🤝 Support

Hvis du trenger hjelp, kontakt meg i chatten!

---
Laget med ❤️ for Simen
