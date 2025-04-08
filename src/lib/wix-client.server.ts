import { ApiKeyStrategy, createClient, Tokens } from "@wix/sdk";
import { cookies } from "next/headers";
import { cache } from "react";
import { env } from "@/env";
import {files} from "@wix/media"
import { getWixClient } from "@/lib/wix-client.base";
import { WIX_SESSION_COOKIE } from "@/lib/constants";

export const getWixServerClient = cache (async ()=> { // Make function async
    let tokens: Tokens | undefined;

    try {
        const cookieStore = await cookies(); // Await cookies()
        const cookieValue = cookieStore.get(WIX_SESSION_COOKIE)?.value;
        tokens = cookieValue ? JSON.parse(cookieValue) : undefined;
    } catch (error) {
        tokens = undefined;
    }

    return getWixClient(tokens);
})

export const getWixAdminClient = cache(() => {
    const wixClient = createClient({
        modules: {
            files
        },
        auth: ApiKeyStrategy({
            apiKey: env.WIX_API_KEY,
            siteId: env.NEXT_PUBLIC_WIX_SITE_ID,
        })
    })

    return wixClient;
})
