import Image from "next/image";
import banner from "@/assets/banner.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollectionsBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";
import { getWixServerClient } from "@/lib/wix-client.server";

export default  function Home() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <div className="flex items-center bg-secondary md:h-96">
        <div className="space-y-7 p-10 text-center md:w-1/2">
          <h1 className="text-3xl font-bold md:text-4xl">
            Fill the void in your heart
          </h1>
          <p>
            Tough day? Credit card maxed out? Buy some expensive stuff and
            become happy again!
          </p>
          <Button asChild>
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
        <div className="relative hidden h-full w-1/2 md:block">
          <Image
            src={banner}
            alt="Flow Shop Banner"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent"></div>
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton/>}>
        <FeatureProducts />
      </Suspense>
    </main>
  );
}

async function FeatureProducts() {
  

  const wixClient = await getWixServerClient();

  const collection = await getCollectionsBySlug(wixClient,"featured-products")
  
  if (!collection?._id) {
    return null;
  }

  const featuredProducts = await queryProducts(wixClient,{
    collectionIds: collection._id,
  }) ;

    if (!featuredProducts.items.length) {
      return null;
    }
  return <div className="space-y-5">
    <h2 className="text-2xl font-bold">
      Featured Products
    </h2>
    <div className="flex gap-5 flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
    {featuredProducts.items.map((product) => (
      <Product key={product._id} product={product} />
      
    ))}
    </div>
    
  </div>
}


function LoadingSkeleton() {
  return <div className="flex gap-5 flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-12">
    {Array.from({length: 8}).map((_,i) =>(
      <Skeleton key={i} className="h-[26rem] w-full " />
    ))}
  </div>
}