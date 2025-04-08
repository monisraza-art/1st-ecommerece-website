import { getProductBySlug, getRelatedProducts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { getWixServerClient } from "@/lib/wix-client.server";
import { Suspense } from "react";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import CreateProductReviewButton from "@/components/reviews/CreateProductReviewButton";
import { getLoggedInMember } from "@/wix-api/members";
import { products } from "@wix/stores";
import ProductReviews, { ProductReviewsLoadingSkeleton } from "../ProductReviews";
import { getProductReviews } from "@/wix-api/review";

interface PageProps {
  params: { slug: string };
}
export async function generateMetadata({
    params,
  }: PageProps): Promise<Metadata> {

    const {slug} = await params



    const product = await getProductBySlug((await getWixServerClient()), slug);
  
    if (!product) notFound();
  
    const mainImage = product.media?.mainMedia?.image;
  
    return {
      title: product.name,
      description: "Get this product on Flow Shop",
      openGraph: {
        images: mainImage?.url
          ? [
              {
                url: mainImage.url,
                width: mainImage.width,
                height: mainImage.height,
                alt: mainImage.altText || "",
              },
            ]
          : undefined,
      },
    };
  }
  export default async function Page({ params }: PageProps) {

  const {slug} = await params

  const wixClient = await getWixServerClient();
  const product = await getProductBySlug(wixClient, slug);

  if (!product?._id) notFound();

  return (
    <main className="max-w-7xl mx-auto space-y-10 px-5 py-10">
      <ProductDetails product={product} />
      <hr />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <hr />
      <div className="space-y-5">
        <h2 className="text-2xl font-bold">Buyer Reviews</h2>
        <Suspense fallback={<ProductReviewsLoadingSkeleton />}>
          <ProductReviewsSection product={product} />
        </Suspense>
      </div>
    </main>
  );
}

// The rest of the code remains the same


interface RelatedProductsProps {
  productId: string;
}

async function RelatedProducts({ productId }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(await getWixServerClient(), productId);

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Related products</h2>
      <div className="flex flex-col gap-5 sm:grid grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="flex pt-12 flex-col gap-5 sm:grid grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[26rem] w-full" />
      ))}
    </div>
  );
}

interface ProductReviewsSectionProps {
  product: products.Product;
}

async function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  if (!product._id) return null;

  const wixClient = await getWixServerClient();
  const loggedInMember = await getLoggedInMember(wixClient);

  const existingReview = loggedInMember?.contactId
    ? (
        await getProductReviews(wixClient, {
          productId: product._id,
          contactId: loggedInMember.contactId,
        })
      ).items[0]
    : null;

  return (
    <div className="space-y-5">
      <CreateProductReviewButton
        product={product}
        LoggedInMember={loggedInMember}
        hasExistingReview={!!existingReview}
      />
      <ProductReviews product={product} />
    </div>
  );
}
