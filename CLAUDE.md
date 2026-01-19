# CLAUDE.md - AI Assistant Guidelines for Kompis App

This file provides context and guidelines for AI assistants working on this codebase.

## Mentorship Mode

**The user is learning to code.** Be proactive in teaching professional practices:

- **Explain the "why"** - Don't just write code; briefly explain why a pattern is used
- **Suggest improvements** - When you spot opportunities to level up their skills, mention them
- **Teach incrementally** - Introduce one new concept at a time, don't overwhelm
- **Celebrate progress** - Acknowledge when they're applying good patterns

### Teaching Opportunities to Watch For

| When you see... | Teach about... |
|-----------------|----------------|
| Repeated code | Extracting reusable components or functions |
| Missing error handling | Try-catch patterns and user feedback |
| Untyped variables | TypeScript benefits and proper typing |
| Large components | Component composition and separation of concerns |
| Magic numbers/strings | Constants and configuration patterns |
| Direct state mutation | Immutability and why React needs it |
| Console.log debugging | Proper debugging techniques |
| No loading states | UX best practices for async operations |
| Hardcoded data | Environment variables and configuration |

### How to Give Feedback

```
Good: "This works! One thing that will help as the app grows: 
      extracting this into a separate component makes it reusable 
      and easier to test."

Avoid: "This is wrong. You should have done X instead."
```

Keep explanations brief and practical. Link concepts to real benefits they'll experience.

## Project Overview

**Kompis** is a React Native + Expo mobile app for peer-to-peer help/moving services (Norwegian market). It uses modern TypeScript with strict type checking.

## Tech Stack

- **Runtime:** React Native 0.81.5 + Expo 54.0.0
- **Language:** TypeScript 5.7+ (strict mode)
- **State:** React Context API + AsyncStorage
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **Styling:** React Native StyleSheet
- **Icons:** Ionicons via @expo/vector-icons
- **Package Manager:** pnpm (required, not npm or yarn)

## Critical Rules

### Always Use TypeScript

- **NEVER** create `.js` or `.jsx` files - only `.ts` and `.tsx`
- The project enforces this via `pnpm check:no-js`
- All code must pass strict TypeScript checking

### Always Use ESM

- Use ES modules (`import`/`export`), never CommonJS (`require`/`module.exports`)
- Exception: `babel.config.cjs` must stay CommonJS (Babel requirement)

### Always Use pnpm

- Use `pnpm add <package>` to install dependencies
- Use `pnpm add -D <package>` for dev dependencies
- Never use npm or yarn commands

## Code Style (Enforced by Biome)

```
- Indentation: 2 spaces (not tabs)
- Quotes: Single quotes ('string')
- Semicolons: Always required
- Line width: 100 characters max
- Trailing commas: ES5 style
```

Run `pnpm format` to auto-format code.

## Commands Reference

```bash
pnpm start        # Start Expo dev server
pnpm android      # Run on Android
pnpm ios          # Run on iOS
pnpm web          # Run on web

pnpm lint         # Check for linting errors
pnpm format       # Auto-format all files
pnpm check        # Lint and fix issues
pnpm typecheck    # Run TypeScript type checking
pnpm validate     # Run all checks (typecheck + lint + check:no-js)
```

**Always run `pnpm validate` before committing** to ensure code quality.

## Project Structure

```
/kompis
├── App.tsx                 # Entry point (providers + navigation)
├── KompisApp.tsx           # Main app UI component
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── navigation/
│   └── AppNavigator.tsx    # Navigation stack configuration
├── screens/
│   ├── HomeScreen.tsx      # Home screen (renders KompisApp)
│   ├── LoginScreen.tsx     # Login form
│   └── RegisterScreen.tsx  # Registration form
├── types/
│   └── index.ts            # Shared TypeScript type definitions
└── assets/                 # Images, fonts, etc.
```

## TypeScript Patterns

### Define Types in `/types/index.ts`

Centralize shared types:

```typescript
// Good - in types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export type JobCategory = 'all' | 'furniture' | 'moving' | 'recycling';
```

### Type Component Props

```typescript
interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button = ({ label, onPress, disabled = false }: ButtonProps) => {
  // ...
};
```

### Type Navigation

```typescript
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

interface ScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'ScreenName'>;
}
```

### Avoid `any`

- Never use `any` type - find the correct type or use `unknown`
- Biome warns on explicit `any` usage

## Component Patterns

### Functional Components Only

```typescript
// Good - functional component with hooks
const MyComponent = () => {
  const [state, setState] = useState(false);
  return <View>...</View>;
};

// Bad - class components
class MyComponent extends React.Component {} // Don't use
```

### Use the Auth Context

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
};
```

### StyleSheet Pattern

```typescript
import { StyleSheet, View, Text } from 'react-native';

const MyComponent = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Hello</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

## Import Organization

Biome auto-organizes imports. Follow this order:

```typescript
// 1. React and React Native
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. External libraries
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// 3. Internal imports (contexts, components, utils)
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

// 4. Types (use 'import type' for type-only imports)
import type { User, Job } from '../types';
```

## Error Handling Pattern

```typescript
const doSomething = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // operation
    return { success: true };
  } catch (error) {
    console.error('Operation failed:', error);
    return { success: false, error: 'User-friendly error message' };
  }
};
```

## Async Storage Usage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
await AsyncStorage.setItem('key', JSON.stringify(data));

// Load data
const stored = await AsyncStorage.getItem('key');
const data = stored ? JSON.parse(stored) : null;

// Remove data
await AsyncStorage.removeItem('key');
```

## Animation Pattern

```typescript
import { Animated } from 'react-native';

const slideAnim = useRef(new Animated.Value(0)).current;

const animate = () => {
  Animated.spring(slideAnim, {
    toValue: 100,
    useNativeDriver: true, // Always use native driver when possible
    tension: 50,
    friction: 8,
  }).start();
};
```

## Common Mistakes to Avoid

1. **Creating .js files** - Always use .ts or .tsx
2. **Using npm/yarn** - Always use pnpm
3. **Using `any` type** - Find the correct type
4. **Using `var`** - Use `const` or `let`
5. **Using class components** - Use functional components with hooks
6. **Inline styles** - Use StyleSheet.create()
7. **Missing semicolons** - Biome requires them
8. **Double quotes** - Use single quotes
9. **Forgetting to type props** - Always define prop interfaces
10. **CommonJS imports** - Use ES module syntax

## When Adding New Features

1. **Create types first** in `/types/index.ts`
2. **Create the component** with proper TypeScript types
3. **Use existing patterns** from similar components
4. **Run `pnpm validate`** to check for errors
5. **Fix any TypeScript or linting errors** before committing

## When Adding Dependencies

```bash
# Regular dependency
pnpm add package-name

# Dev dependency
pnpm add -D package-name

# Expo-compatible package (preferred for RN)
pnpm expo install package-name
```

Always check if an Expo-compatible version exists before installing generic npm packages.

## File Naming Conventions

- **Components:** PascalCase (`MyComponent.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Types:** camelCase or index (`types/index.ts`)
- **Contexts:** PascalCase with Context suffix (`AuthContext.tsx`)

## Testing Changes

After making changes:

```bash
pnpm validate      # Run all checks
pnpm start         # Start the app and test manually
```

The app should:
- Compile without TypeScript errors
- Pass all linting rules
- Run without runtime errors
