import { ObjectId } from "mongodb";

type WithMongoId = { _id: ObjectId };

/** Maps a Mongo document's `_id` to the string `id` field the rest of the app expects. */
export function serialize<T extends WithMongoId>(doc: T): Omit<T, "_id"> & { id: string } {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() } as Omit<T, "_id"> & { id: string };
}

export function serializeAll<T extends WithMongoId>(docs: T[]): (Omit<T, "_id"> & { id: string })[] {
  return docs.map(serialize);
}

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}
