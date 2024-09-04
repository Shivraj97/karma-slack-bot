import { Db } from "mongodb";
import clientPromise from "./mongodb";

let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  const client = await clientPromise;
  db = client.db("karmabotdb");
  return db;
}
