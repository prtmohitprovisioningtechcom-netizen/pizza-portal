import type { ProductDTO, ProductVariantItem } from "@/types";

type PopulatedCategoryId = { _id: string; name: string };

type LeanProduct = {
  _id: string | { toString: () => string };
  id?: number | string;
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId?: string | number | PopulatedCategoryId | null;
  image?: string;
  isVeg: boolean;
  variants?: ProductVariantItem[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function toProductDTO(doc: LeanProduct): ProductDTO {
  const variants = Array.isArray(doc.variants)
    ? doc.variants.map((v) => ({
        label: v.label,
        price: v.price,
      }))
    : [];

  let category = doc.category;
  let categoryId: string | undefined;
  const cid = doc.categoryId;
  if (cid && typeof cid === "object" && "name" in cid) {
    category = (cid as PopulatedCategoryId).name;
    categoryId = String((cid as PopulatedCategoryId)._id);
  } else if (cid != null && cid !== null) {
    categoryId = String(cid);
  }

  const id = doc._id ? (typeof doc._id === "object" ? doc._id.toString() : String(doc._id)) : String(doc.id ?? "");

  const createdAt = doc.createdAt instanceof Date ? doc.createdAt.toISOString() : (doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined);
  const updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : (doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined);

  return {
    _id: id,
    name: doc.name,
    description: doc.description ?? "",
    price: Number(doc.price),
    categoryId,
    category,
    image: doc.image ?? "",
    isVeg: Boolean(doc.isVeg),
    variants: variants.length ? variants : undefined,
    createdAt,
    updatedAt,
  };
}
