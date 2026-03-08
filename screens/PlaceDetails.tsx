import OutlinedButton from '@/components/UI/OutlinedButton';
import { Colors } from '@/constants/color';
import { Place } from '@/types/place';
import { fetchPlace } from '@/utils/database';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const PlaceDetails = ({ route }: { route: any }) => {
  const [fetchedPlace, setFetchedPlace] = useState<Place | null>(null);
  const place = route.params.place;
  const navigation = useNavigation();

  useEffect(() => {
    const loadPlace = async () => {
      const fetchedPlace = await fetchPlace(place.id);
      setFetchedPlace(fetchedPlace as Place);
      (navigation as any).setOptions({
        title: fetchedPlace.title
      });
    }
    loadPlace();
  }, [place, navigation]);

  const showOnMapHandler = () => {
    (navigation as any).navigate('Map', {
      initialLat: fetchedPlace?.location.lat,
      initialLng: fetchedPlace?.location.lng
    });
  }
  
  if (!fetchedPlace) {
    return <Text style={styles.fallback}>Loading place...</Text>
  }
  
  return (
    <ScrollView>
      <Image source={{ uri: fetchedPlace?.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace?.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>View on Map</OutlinedButton>
      </View>
    </ScrollView>
  )
}

export default PlaceDetails

const styles = StyleSheet.create({
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})