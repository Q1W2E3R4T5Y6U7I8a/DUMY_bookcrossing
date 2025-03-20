import { View, Image, StyleSheet, ActivityIndicator, Text } from 'react-native';
import useDayOfYear from '../hooks/useDayOfYear';
import { LanguageContext } from '../context/LanguageContext';
import { useContext } from 'react';

export default function HomeScreen() {
  const { currentId, imageUrls } = useDayOfYear();
  const { language } = useContext(LanguageContext);

  // Get the current image URL based on the day of the year
  const imageSource = currentId !== null ? { uri: imageUrls[currentId] } : null;

  if (currentId === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (language !== 'ukrainian') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {language === 'english'
            ? 'This page is done only in Ukrainian yet.'
            : 'Cette page est encore disponible uniquement en ukrainien.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageSource && (
        <Image
          source={imageSource}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});