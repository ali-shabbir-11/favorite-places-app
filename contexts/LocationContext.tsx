import React, { createContext, useContext, useState } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  snapshotUri?: string;
}

interface LocationContextType {
  pickedLocation: LocationData | null;
  setPickedLocation: (location: LocationData | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pickedLocation, setPickedLocation] = useState<LocationData | null>(null);

  return (
    <LocationContext.Provider value={{ pickedLocation, setPickedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 