import { Colors } from '@/constants/color';
import { useLocation } from '@/contexts/LocationContext';
import { getAddress } from '@/utils/location';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getCurrentPositionAsync, PermissionStatus, useForegroundPermissions } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import OutlinedButton from '../UI/OutlinedButton';

const LocationPicker = ({ onPickLocation }: { onPickLocation: (location: { lat: number, lng: number, address: string }) => void }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { pickedLocation: contextLocation } = useLocation();
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
  const [pickedLocation, setPickedLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (contextLocation && isFocused) {
      setPickedLocation({ lat: contextLocation.lat, lng: contextLocation.lng });
    }
  }, [contextLocation, isFocused]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (pickedLocation) {
        const address = await getAddress(pickedLocation.lat, pickedLocation.lng);
        onPickLocation({ ...pickedLocation, address });
      }
    }
    if (pickedLocation) {
      fetchAddress();
    }
  }, [pickedLocation, onPickLocation]);

  const verifyPermissions = async () => {
    if (locationPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert('Insufficient permissions!', 'You need to grant location permissions to use this app.');
      return false;
    }

    return true;
  }

  const pickOnMapHandler = () => {
    (navigation as any).navigate('Map');
  }

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  let locationPreview = <Text>No location picked yet.</Text>;
  if (pickedLocation) {
    locationPreview = <Image source={{ uri: contextLocation?.snapshotUri }} style={styles.image} />;
  }

  return (
    <View>
      <View style={styles.mapPreview}>
        {locationPreview}
      </View>
      <View style={styles.actions}>
        <OutlinedButton disabled={true} onPress={getLocationHandler} icon='location'>Locate User</OutlinedButton>
        <OutlinedButton onPress={pickOnMapHandler} icon='map'>Pick on Map</OutlinedButton>
      </View>
    </View>
  )
}

export default LocationPicker

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
})