import Place from '@/models/place';
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('places.db');
  }
  return db;
};

export const initDatabase = async () => {
  try {
    db = await getDatabase();
    
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        imageUri TEXT NOT NULL,
        address TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const insertPlace = async (place: Place) => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)',
      [place.title, place.imageUri, place.address, place.location.lat, place.location.lng]
    );
    
    console.log('Place inserted with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to insert place:', error);
    throw error;
  }
};

export const fetchPlaces = async (): Promise<Place[]> => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync('SELECT * FROM places');
    
    const places = result.map((row: any) => new Place(
      row.title,
      row.imageUri,
      row.address,
      { lat: row.lat, lng: row.lng },
      row.id.toString()
    ));
    
    console.log('Fetched places:', places);
    return places;
  } catch (error) {
    console.error('Failed to fetch places:', error);
    throw error;
  }
};

export const fetchPlace = async (id: string): Promise<Place> => {
  try {
    const database = await getDatabase();
    const result = await database.getFirstAsync('SELECT * FROM places WHERE id = ?', [parseInt(id)]) as any;
    if (!result) {
      throw new Error(`Place with id ${id} not found`);
    }
    return new Place(result.title, result.imageUri, result.address, { lat: result.lat, lng: result.lng }, result.id.toString());
  } catch (error) {
    console.error('Failed to fetch place:', error);
    throw error;
  }
};

export const deletePlace = async (id: string) => {
  try {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM places WHERE id = ?', [parseInt(id)]);
    console.log('Place deleted with ID:', id);
  } catch (error) {
    console.error('Failed to delete place:', error);
    throw error;
  }
};

export const updatePlace = async (place: Place) => {
  try {
    const database = await getDatabase();
    await database.runAsync(
      'UPDATE places SET title = ?, imageUri = ?, address = ?, lat = ?, lng = ? WHERE id = ?',
      [place.title, place.imageUri, place.address, place.location.lat, place.location.lng, parseInt(place.id)]
    );
    console.log('Place updated with ID:', place.id);
  } catch (error) {
    console.error('Failed to update place:', error);
    throw error;
  }
};
