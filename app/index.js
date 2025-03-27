import { View, Image, StyleSheet, Text, AppState, TouchableOpacity } from 'react-native';
import useDayOfYear from '../hooks/useDayOfYear';
import { useContext, useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, increment, arrayUnion, onSnapshot } from 'firebase/firestore';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { LanguageContext } from '../context/LanguageContext';
import { CountersContext } from '../context/CountersContext';

export default function HomeScreen() {
  const { currentId, imageUrls, quotes } = useDayOfYear();
  const { language } = useContext(LanguageContext);
  const { isCountersVisible, setIsCountersVisible } = useContext(CountersContext);
  const [visitCount, setVisitCount] = useState(0);
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const imageSource = currentId !== null ? { uri: imageUrls[currentId] } : null;
  const appState = useRef(AppState.currentState);

  // Get or create persistent device ID
  const getOrCreateDeviceId = async () => {
    try {
      let deviceId = await SecureStore.getItemAsync('deviceId');
      if (!deviceId) {
        deviceId = Application.androidId || Math.random().toString(36).substring(2) + Date.now().toString(36);
        await SecureStore.setItemAsync('deviceId', deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('Error with device ID:', error);
      return Application.androidId || Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  };

  useEffect(() => {
    const updateCounters = async () => {
      const today = new Date().toISOString().split('T')[0];
      const visitRef = doc(db, 'visits', today);
      const deviceId = await getOrCreateDeviceId();
      
      await setDoc(visitRef, {
        count: increment(1),
        uniqueUsers: arrayUnion(deviceId),
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      const updatedDoc = await getDoc(visitRef);
      setVisitCount(updatedDoc.data().count || 0);
      setUniqueUsersCount(updatedDoc.data().uniqueUsers?.length || 0);
    };

    updateCounters();
  }, []);

  useEffect(() => {
    let onlineRef;
    let subscription;

    const manageOnlineStatus = async () => {
      const deviceId = await getOrCreateDeviceId();
      onlineRef = doc(db, 'onlineUsers', deviceId);
      
      // Initial status update
      await setDoc(onlineRef, {
        status: 'online',
        lastActive: new Date().toISOString(),
        deviceType: 'android'
      }, { merge: true });

      // Handle app state changes
      const handleAppStateChange = async (nextAppState) => {
        if (nextAppState === 'active') {
          // App came to foreground
          await setDoc(onlineRef, {
            status: 'online',
            lastActive: new Date().toISOString()
          }, { merge: true });
        } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          // App returned from background
          await setDoc(onlineRef, {
            status: 'online',
            lastActive: new Date().toISOString()
          }, { merge: true });
        } else {
          // App went to background
          await setDoc(onlineRef, {
            status: 'offline',
            lastActive: new Date().toISOString()
          }, { merge: true });
        }
        appState.current = nextAppState;
      };

      subscription = AppState.addEventListener('change', handleAppStateChange);
    };

    manageOnlineStatus();

    return () => {
      // Cleanup - mark offline when component unmounts
      if (onlineRef) {
        setDoc(onlineRef, {
          status: 'offline',
          lastActive: new Date().toISOString()
        }, { merge: true });
      }
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const onlineUsersRef = collection(db, 'onlineUsers');
    const unsubscribe = onSnapshot(onlineUsersRef, (snapshot) => {
      const now = new Date();
      const onlineUsers = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.status === 'online' && 
               new Date(data.lastActive) > new Date(now - 5*60*1000);
      });
      setOnlineUsersCount(onlineUsers.length);
    });

    return () => unsubscribe();
  }, []);

  const toggleCountersVisibility = () => {
    setIsCountersVisible(prev => !prev);
  };

  if (language !== 'ukrainian') {
    return (
      <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.not_ready_message}>
          {language === 'english'
            ? 'Text of daily quotes only in ukrainian yet'
            : 'Le texte des citations quotidiennes est uniquement en ukrainien pour l\'instant'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCountersVisible && (
        <View style={styles.counters}>
          <TouchableOpacity hitSlop={40} style={styles.closeButton} onPress={toggleCountersVisibility}>
            <Text style={styles.closeButtonText}>▼</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>Відвідувань сьогодні: {visitCount}</Text>
          <Text style={styles.counterText}>Унікальних пристроїв: {uniqueUsersCount}</Text>
          <Text style={styles.counterText}>Онлайн зараз: {onlineUsersCount}</Text>
          <Text style={styles.infoText}>
            Якщо буде 30 користувачів, яким цікавий цей додаток, {'\n'}
            працюватиму над версією 3.0, {'\n'}
            в який включу ваші побажання, і зроблю {'\n'}
            вже по-суті невелику соц мережу
          </Text>
        </View>
      )}
      {imageSource && <Image source={imageSource} style={styles.image} />}
      {!isCountersVisible && (
        <TouchableOpacity hitSlop={10} style={styles.openButton} onPress={toggleCountersVisibility}>
          <Text style={styles.openButtonText}>▲</Text>
        </TouchableOpacity>
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
  counters: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'column',
    gap: 8,
    backgroundColor: '#b7b6af',
    padding: 8,
    borderRadius: 8,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  counterText: {
    fontSize: 12,
  },
  infoText: {
    fontSize: 8,
    color: '#5c5b58',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28, 
    height: 28, 
    borderRadius: 20,
    backgroundColor: '#e5e4db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  openButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 12,
    height: 12,
    borderRadius: 16,
    backgroundColor: '#b7b6af',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    opacity: 0.05,
  },
  openButtonText: {
    fontSize: 16,
    color: '#000',
  },
  not_ready_message: {
    position: 'absolute',
    bottom: '25%', 
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});