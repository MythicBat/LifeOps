export const LIFEOPS_EVENTS = {
    openCommand: "lifeops:open-command",
    openUpload: "lifeops-open-upload",
} as const;

export function openLifeOpsCommand() {
    window.dispatchEvent(
        new CustomEvent(LIFEOPS_EVENTS.openCommand)
    );
}

export function openUniversalDrop() {
    window.dispatchEvent(
        new CustomEvent(LIFEOPS_EVENTS.openUpload)
    );
}