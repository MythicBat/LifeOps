import {
    fetchAuthSession,
    fetchUserAttributes,
    getCurrentUser,
    signOut,
} from "aws-amplify/auth";

export interface LifeOpsUser {
    id: string;
    name: string;
    email: string;
    initials?: string;
}

export async function getLifeOpsUser(): Promise<LifeOpsUser | null> {
    try {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        const name = attributes.name ?? attributes.email ?? "LifeOps User";
        const email = attributes.email ?? "";

        return {
            id: currentUser.userId,
            name,
            email,
            initials: getInitials(name),
        };
    } catch {
        return null;
    }
}

export async function getAccessToken(): Promise<string | null> {
    try {
        const session = await fetchAuthSession();

        return (
            session.tokens?.accessToken?.toString() ?? null
        );
    } catch {
        return null;
    }
}

export async function logout() {
    await signOut();
}

function getInitials(name: string) {
    const words = name.trim().split("/\s+/").filter(Boolean);

    if (words.length === 0) {
        return "LO";
    }

    if (words.length === 1) {
        return words[0].slice(0,2).toUpperCase();
    }

    return (
        words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
}