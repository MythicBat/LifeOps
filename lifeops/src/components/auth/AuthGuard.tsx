"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";

const PUBLIC_ROUTES = [
    "/login",
    "/signup",
    "/verify",
    "/forgot-password",
];

export function AuthGuard({
    children,
} : {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    const [checked, setChecked] = useState(isPublic);

    useEffect(() => {
        if (isPublic) { return; }

        let active = true;

        async function check() {
            try {
                await getCurrentUser();

                if (active) {
                    setChecked(true);
                }
            } catch {
                if (active) {
                    router.replace("/login");
                }
            }
        }

        check();

        return () => {
            active = false;
        };
    }, [isPublic, router]);

    if (isPublic) {
        return children;
    }

    if (!checked) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-pulse rounded-[14px] bg-zinc-950" />

                    <p className="mt-4 text-sm text-zinc-400">
                        Opening LifeOps...
                    </p>
                </div>
            </main>
        );
    }

    return children;
}