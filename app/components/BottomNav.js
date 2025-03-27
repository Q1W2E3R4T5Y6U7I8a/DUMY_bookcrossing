import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useContext(LanguageContext);

  return (
    <View style={styles.nav}>
    <Link href="/" asChild>
      <TouchableOpacity style={[styles.button, pathname === "/" && styles.activeButton]}>
        <Text style={[styles.text, pathname === "/" && styles.activeText]}>{language === "ukrainian" ? "Головна" : language === "english" ? "Main" : "Principale"}</Text>
      </TouchableOpacity>
    </Link>
    <Link href="/books" asChild>
      {language !== "english" && language !== "french" && (
        <TouchableOpacity style={[styles.button, pathname === "/books" && styles.activeButton]}>
          <Text style={[styles.text, pathname === "/books" && styles.activeText]}>
            Книги
          </Text>
        </TouchableOpacity>
      )}
    </Link>
    <Link href="/dumy" asChild>
      <TouchableOpacity style={[styles.button, pathname === "/dumy" && styles.activeButton]}>
        <Text style={[styles.text, pathname === "/dumy" && styles.activeText]}>{language === "ukrainian" ? "ДУМИ" : language === "english" ? "DUMY" : "DUMY"}</Text>
      </TouchableOpacity>
    </Link>
  </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#b7b6af',
  },
  button: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#1691D9',
  },
  text: {
    color: '#000',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});