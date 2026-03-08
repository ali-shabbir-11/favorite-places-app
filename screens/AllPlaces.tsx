import PlacesList from '@/components/places/PlacesList';
import { Place } from '@/types/place';
import { fetchPlaces } from '@/utils/database';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

const AllPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadPlaces = async () => {
      const places = await fetchPlaces();
      setLoadedPlaces(places);
    }
    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  return (
    <PlacesList places={loadedPlaces} />
  )
}

export default AllPlaces
