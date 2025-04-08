import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import CreateProductReviewButton from "@/components/reviews/CreateProductReviewButton";
import { Skeleton } from "@/components/ui/skeleton";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionsBySlug } from "@/wix-api/collections";
import { getLoggedInMember } from "@/wix-api/members";
import { queryProducts } from "@/wix-api/products";
import { products } from "@wix/stores";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: { slug: string };
  searchParams: {page?: string}
}

export async function generateMetaData({
  params, searchParams: {page = "1"}
}: PageProps): Promise<Metadata> {

  const {slug} = await params


  const collection = await getCollectionsBySlug(
    await getWixServerClient(),
    slug,
  );
  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
}

export default async function Page({ params, searchParams: {page = "1"} }: PageProps) {

  const {slug} = await params

 

  const collection = await getCollectionsBySlug(
    await getWixServerClient(),
    slug,
  );

  if (!collection?._id) notFound();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Products</h2>
      <Suspense fallback={<LoadingSkeleton />} key={page}>
        <Products collectionId={collection._id}
        page={parseInt(page)}
        />
      </Suspense>
    </div>
  );
}

interface ProductsProps {
  collectionId: string;
  page: number;
}

async function Products({ collectionId, page }: ProductsProps) {
    

    const pageSize = 8;

  const collectionProducts = await queryProducts(await getWixServerClient(), {
    collectionIds: collectionId,
    limit: pageSize,
    skip: (page -1) * pageSize
  });

  if (!collectionProducts.length) notFound();

  if (page > (collectionProducts.totalPages || 1)) notFound();

  return (
    <div className="space-y-10">
    <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {collectionProducts.items.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
    <PaginationBar
    currentPage={page}
    totalPages={collectionProducts.totalPages || 1}
    />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-12 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
}


