import { Stack } from 'expo-router';
import Header from './components/Header';
import BottomNav from './components/BottomNav';

import { FavoritesProvider } from '../context/FavoritesContext';
import { LanguageProvider } from '../context/LanguageContext';
import { CountersProvider } from '../context/CountersContext';

export default function Layout() {
  return (
    <>
      <LanguageProvider>
        <Header />
          <CountersProvider>
          <FavoritesProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="books" />
            <Stack.Screen name="dumy" />
            <Stack.Screen name="post/[id]" />
          </Stack>
          </FavoritesProvider>
          </CountersProvider>
        <BottomNav />
      </LanguageProvider>  
    </>
  );
}