"use client"

import LoadingButton from "@/components/LoadingButton";
import Order from "@/components/Order";
import { Skeleton } from "@/components/ui/skeleton";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { GetUserOrder } from "@/wix-api/orders";
import { useInfiniteQuery } from "@tanstack/react-query"

export default function Orders() {
    const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage,} = useInfiniteQuery({
        queryKey: ["orders"],
        queryFn: async ({pageParam}) =>
            GetUserOrder(wixBrowserClient,{
                limit: 2,
                cursor: pageParam
            }),
            initialPageParam: null as string | null,
            getNextPageParam: (lastPage) => lastPage.metadata?.cursors?.next,
    });

    const orders = data?.pages.flatMap(page => page.orders) || [];

    return <div className="space-y-5">
            <h2 className="text-2xl font-bold">Your orders</h2>
            {status === "pending" && <OrderLoadingSkeleton/>}
            {status === "error" && (
                <p className="text-destructive ">Error fetching orders</p>
            )}
            {status === "success" && !orders.length && !hasNextPage && (
                <p>No orders yet</p>
            )}
            {orders.map((order) => (
                <Order key={order.number} order={order} />
            ))}
            {hasNextPage && (
                <LoadingButton
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                >
                    Load more orders
                </LoadingButton>

            )}
    </div>
}

function OrderLoadingSkeleton() {
    return <div className="space-y-5">
        {Array.from({length: 2}).map((_,i) => (
            <Skeleton key={i} className="h-64" />
        ))}
    </div>
}