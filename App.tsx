import IconButton from '@/components/UI/IconButton';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Colors } from './constants/color';
import { LocationProvider } from './contexts/LocationContext';
import AddPlace from './screens/AddPlace';
import AllPlaces from './screens/AllPlaces';
import Map from './screens/Map';
import PlaceDetails from './screens/PlaceDetails';
import { initDatabase } from './utils/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'New Places!',
    body: 'Waiting for you to add them!',
    data: { username: 'John Doe' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const Stack = createStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');


  useEffect(() => {
    const initDB = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    
    initDB();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationSubscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification.request.content.data.username);
    });

    const responseSubscription= Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response.notification.request.content.data.username);
    });

    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      sendPushNotification(expoPushToken);
    }
  }, [expoPushToken]);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    );
  }
  
  return (
    <>
      <StatusBar style="auto" />
      <LocationProvider>
        <SQLiteProvider databaseName="places.db">
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: Colors.gray700,
                headerTitleStyle: { fontWeight: 'bold' },
                cardStyle: { backgroundColor: Colors.gray700 },
              }}
            >
              <Stack.Screen 
                name='AllPlaces' 
                component={AllPlaces}
                options={({ navigation }) => ({ 
                  title: 'Your Favorite Places',
                  headerRight: ({ tintColor }) => (
                    <IconButton icon='add' size={24} color={tintColor} onPress={() => navigation.navigate('AddPlace')} />
                  ),
                })}
              />
              <Stack.Screen 
                name='AddPlace' 
                component={AddPlace}
                options={{ title: 'Add a new place' }}
              />
              <Stack.Screen 
                name='Map' 
                component={Map}
                options={{ title: 'Map' }}
              />
              <Stack.Screen 
                name='PlaceDetails' 
                component={PlaceDetails}
                options={{ title: 'Loading place...' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SQLiteProvider>
      </LocationProvider>
    </>
  );
} 