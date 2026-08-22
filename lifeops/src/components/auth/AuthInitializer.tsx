"use client";

import { configuredAmplify } from "@/lib/auth/amplify";

configuredAmplify();

export function AuthInitializer() {
    return null;
}