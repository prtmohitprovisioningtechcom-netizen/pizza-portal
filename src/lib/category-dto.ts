import type { CategoryDTO } from "@/types";

type CategoryLean = {
  _id?: string | { toString: () => string };
  id?: number | string;
  name: string;
  sortOrder?: number;
  image?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function categoryDocToDTO(doc: CategoryLean): CategoryDTO {
  const id = doc._id ? (typeof doc._id === "object" ? doc._id.toString() : String(doc._id)) : String(doc.id ?? "");
  const createdAt = doc.createdAt instanceof Date ? doc.createdAt.toISOString() : (doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined);
  const updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : (doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined);

  return {
    _id: id,
    name: doc.name,
    sortOrder: doc.sortOrder ?? 0,
    image: doc.image ?? "",
    createdAt,
    updatedAt,
  };
}
