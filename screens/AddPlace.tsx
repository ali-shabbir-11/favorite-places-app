import PlaceForm from '@/components/places/PlaceForm'
import { insertPlace } from '@/utils/database'
import React from 'react'

const AddPlace = ({ navigation }: { navigation: any }) => {
  const onCreatePlace = async (place: any) => {
    await insertPlace(place);
    navigation.navigate('AllPlaces');
  }

  return (
    <PlaceForm onCreatePlace={onCreatePlace} />
  )
}

export default AddPlace
