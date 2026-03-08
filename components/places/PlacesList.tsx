import { useNavigation } from '@react-navigation/native'
import { FlatList, StyleSheet, Text } from 'react-native'
import { Colors } from '../../constants/color'
import { Place } from '../../types/place'
import PlaceItem from './PlaceItem'

const PlacesList = ({places}: {places: Place[]}) => {
  const navigation = useNavigation();

  const onSelectPlace = (id: string) => {
    (navigation as any).navigate('PlaceDetails', {
      place: places.find((place) => place.id === id)
    });
  }

  if(!places || places.length === 0) {
    return <Text style={styles.fallbackText}>No places added yet - start adding some!</Text>
  }

  return (
    <FlatList style={styles.list} data={places} keyExtractor={(item) => item.id} renderItem={({item}) => <PlaceItem place={item} onSelect={onSelectPlace} />} />
  )
}

export default PlacesList

const styles = StyleSheet.create({
  list: {
    margin: 24,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.primary200,
  },
})