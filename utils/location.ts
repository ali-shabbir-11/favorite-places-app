export const getMapPreview = (lat?: number, lng?: number) => {
  if (!lat || !lng) {
    return;
  }

  const imagePreviewUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat%3A${lng}%2C${lat}&zoom=14.3497&marker=lonlat%3A${lng}%2C${lat}%3Btype%3Aawesome%3Bcolor%3A%23bb3f73%3Bsize%3Ax-large%3Bicon%3Apaw%7Clonlat%3A${lng}%2C${lat}%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome%7Clonlat%3A${lng}%2C${lat}%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome&apiKey=${API_KEY}`;
  console.log(imagePreviewUrl);
  return imagePreviewUrl;
}

export const getAddress = async (lat: number, lng: number) => {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch address');
  }
  const data = await response.json();
  const address = data.features[0].properties.formatted;
  return address;
}
