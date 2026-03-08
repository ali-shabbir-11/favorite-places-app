import IconButton from '@/components/UI/IconButton';
import { useLocation } from '@/contexts/LocationContext';
import { getAddress } from '@/utils/location';
import { NavigationProp } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker } from 'react-native-maps';

const Map = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const initialLocation = navigation.getState().routes[navigation.getState().index].params;
  const { setPickedLocation } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(initialLocation ? { latitude: initialLocation.initialLat, longitude: initialLocation.initialLng } : null);
  const mapRef = useRef<MapView>(null);
  console.log(initialLocation);
  const region = {
    latitude: initialLocation?.initialLat || 37.78,
    longitude: initialLocation?.initialLng || -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  const handleSelectLocation = (event: MapPressEvent) => {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ latitude: lat, longitude: lng });
  }

  const takeSnapshot = useCallback(async () => {
    if (!mapRef.current) {
      Alert.alert('Error', 'Map not ready');
      return;
    }

    try {
      const snapshot = await mapRef.current.takeSnapshot({
        // width: 300,
        height: 200,
        format: 'png',
        quality: 0.8,
        result: 'file',
        region: selectedLocation ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        } : undefined
      });
      return snapshot;
    } catch (error) {
      console.error('Error taking snapshot:', error);
      Alert.alert('Error', 'Failed to take snapshot');
    }
  }, [selectedLocation]);

  const savePickedLocationHandler = useCallback(async () => {
    if (!selectedLocation) {
      Alert.alert('No location picked!', 'Please pick a location on the map first.');
      return;
    }
    const address = await getAddress(selectedLocation.latitude, selectedLocation.longitude);
    try {
      const snapshotUri = await takeSnapshot();
      setPickedLocation({
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
        address,
        snapshotUri
      });
      
      navigation.goBack();
    } catch (error) {
      console.error('Error getting address:', error);
      setPickedLocation({
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
        address,
      });
      
      navigation.goBack();
    }
  }, [navigation, selectedLocation, setPickedLocation, takeSnapshot]);

  useLayoutEffect(() => {
    if (initialLocation) {
      return;
    } 
    navigation.setOptions({
      headerRight: ({ tintColor }: { tintColor: string }) => <IconButton icon='save' size={24} color={tintColor} onPress={savePickedLocationHandler} />,
    });
  }, [navigation, savePickedLocationHandler, initialLocation]);

  return (
    <MapView 
      ref={mapRef}
      style={styles.map} 
      initialRegion={region} 
      onPress={handleSelectLocation}
    >
      {selectedLocation && <Marker title='Picked Location' coordinate={selectedLocation} />}
    </MapView> 
  )
}

export default Map

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})