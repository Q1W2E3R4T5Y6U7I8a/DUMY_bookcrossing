import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
    <Link href="/" asChild>
      <TouchableOpacity style={[styles.button, pathname === "/" && styles.activeButton]}>
        <Text style={[styles.text, pathname === "/" && styles.activeText]}>Main</Text>
      </TouchableOpacity>
    </Link>
    <Link href="/books" asChild>
      <TouchableOpacity style={[styles.button, pathname === "/books" && styles.activeButton]}>
        <Text style={[styles.text, pathname === "/books" && styles.activeText]}>Books</Text>
      </TouchableOpacity>
    </Link>
    <Link href="/dumy" asChild>
      <TouchableOpacity style={[styles.button, pathname === "/dumy" && styles.activeButton]}>
        <Text style={[styles.text, pathname === "/dumy" && styles.activeText]}>Dumy</Text>
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
    backgroundColor: 'blue',
  },
  text: {
    color: '#000',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});