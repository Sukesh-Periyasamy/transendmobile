/**
 * App.js - Main Entry Point
 * 
 * This is the root component of the Driver App. It sets up the global context provider
 * and initializes the main navigation system with error boundary protection.
 * 
 * Key Components:
 * - ErrorBoundary: Catches and handles JavaScript errors gracefully
 * - AppProvider: Wraps the entire app with global state management
 * - AppNavigator: Handles all navigation between screens
 * - StatusBar: Controls the device status bar appearance
 * 
 * @author Driver App Team
 * @version 1.0.0
 */

import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import ErrorBoundary from './src/components/ErrorBoundary';

/**
 * Main App Component
 * 
 * Wraps the entire application with necessary providers and sets up the navigation.
 * The ErrorBoundary ensures the app doesn't crash completely if there are JavaScript errors.
 * The AppProvider ensures all screens have access to global state (user, jobs, notifications).
 * 
 * @returns {JSX.Element} The root application component
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        {/* Main navigation system with all screen routing */}
        <AppNavigator />
        
        {/* Status bar configuration - auto adjusts for light/dark content */}
        <StatusBar style="auto" />
      </AppProvider>
    </ErrorBoundary>
  );
}
