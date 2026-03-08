class Place {
  id: string;
  constructor(
    public title: string,
    public imageUri: string,
    public address: string,
    public location: { lat: number, lng: number },
    id?: string
  ) {
    this.id = id || new Date().toString() + Math.random().toString();
    this.title = title;
    this.imageUri = imageUri;
    this.address = address;
    this.location = { lat: location.lat, lng: location.lng };
  }
}

export default Place;