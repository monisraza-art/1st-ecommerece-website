import { WixClient } from "@/lib/wix-client.base";
import { collections } from "@wix/stores";
import { cache } from "react";

export const   getCollectionsBySlug =  cache (async (wixClient : WixClient ,slug: string) =>{
  const { collection } =
    await wixClient.collections.getCollectionBySlug(slug);

    return collection || null;
})

export const getCollections = cache(
  async (wixClient: WixClient): Promise<collections.Collection[]> => {
    const collections = await wixClient.collections
    .queryCollections()
    .ne("_id","00000000-000000-000000-000000000001") // all products
    .ne("_id","49cfccb9-40aa-8c97-cc96-459bbe1cb27d") // featured products
    .find();

    return collections.items;
  }
)
