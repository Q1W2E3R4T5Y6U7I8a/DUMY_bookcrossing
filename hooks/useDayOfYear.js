import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import * as Notifications from 'expo-notifications';

const useDayOfYear = () => {
  const [imageUrls, setImageUrls] = useState({});
  const [quotes, setQuotes] = useState({});
  const [currentId, setCurrentId] = useState(null);

  // Function to calculate the day of the year
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0); // Start of the year
    const diff = now - start; // Difference in milliseconds
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in one day
    const dayOfYear = Math.floor(diff / oneDay); // Day of the year (1 to 365/366)
    return dayOfYear;
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to send notifications was denied!');
    }
  };

  const scheduleDailyNotification = async (quote, author) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'DUMY',
        body: `${quote}\n- ${author}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotesCollection = collection(db, 'quotes');
        const quotesSnapshot = await getDocs(quotesCollection);
        const imageData = {};
        const quoteData = {};

        quotesSnapshot.docs.forEach((doc) => {
          const id = parseInt(doc.id, 10);
          imageData[id] = doc.data().image; 
          quoteData[id] = {
            quote: doc.data().quote,
            author: doc.data().author,
          }; 
        });

        setImageUrls(imageData);
        setQuotes(quoteData);

        const dayOfYear = getDayOfYear();
        console.log('Day of the year:', dayOfYear); 
        setCurrentId(dayOfYear);

        if (quoteData[dayOfYear]) {
          const { quote, author } = quoteData[dayOfYear];
          await scheduleDailyNotification(quote, author);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    requestNotificationPermissions();
    fetchData();
  }, []);

  return { currentId, imageUrls };
};

export default useDayOfYear;