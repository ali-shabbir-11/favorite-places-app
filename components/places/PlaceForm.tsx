import { useLocation } from '@/contexts/LocationContext';
import Place from '@/models/place';
import * as Notifications from 'expo-notifications';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/color';
import Button from '../UI/Button';
import ImagePicker from './ImagePicker';
import LocationPicker from './LocationPicker';

const PlaceForm = ({ onCreatePlace }: { onCreatePlace: (place: any) => void }) => {
  const { setPickedLocation: setContextLocation } = useLocation();
  const [enteredTitle, setEnteredTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number, lng: number, address: string } | undefined>(undefined);

  useEffect(() => {
    const verifyNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== Notifications.PermissionStatus.GRANTED) {
        Alert.alert(
          'Permission Required',
          'This app needs notification permissions to notify you about your favorite places. Please enable notifications in your device settings.'
        );
      }
    };

    verifyNotificationPermissions();
  }, []);

  const changeTitleHandler = (text: string) => {
    setEnteredTitle(text);
  }

  const pickLocationHandler = useCallback((location: { lat: number, lng: number, address: string }) => {
    setPickedLocation(location);
  }, []);


  const scheduleNotification = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== Notifications.PermissionStatus.GRANTED) {
      console.log('Notification permissions not granted, skipping notification');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Looks like you are in a new place!',
        body: 'Amazing! Enjoy your time there!',
        data: { username: 'John Doe' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1
      },
    });
  }

  const savePlaceHandler = async () => {
    if (!enteredTitle.trim() || !selectedImage || !pickedLocation?.address || !pickedLocation?.lat || !pickedLocation?.lng) {
      Alert.alert('Invalid input', 'Please check your input values');
      return;
    }
    const placeData = new Place(enteredTitle, selectedImage, pickedLocation.address, { lat: pickedLocation.lat, lng: pickedLocation.lng });
    onCreatePlace(placeData);
    await scheduleNotification()
    setEnteredTitle('');
    setSelectedImage(undefined);
    setPickedLocation(undefined);
    setContextLocation(null);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} onChangeText={changeTitleHandler} value={enteredTitle} />
      </View>
      <ImagePicker onImageTaken={setSelectedImage} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  )
}

export default PlaceForm

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
})