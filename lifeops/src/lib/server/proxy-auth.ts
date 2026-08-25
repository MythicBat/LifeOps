export function getForwardedAuthorization(request: Request) {
    const authorization = request.headers.get("authorization");

    if (!authorization) {
        return null;
    }

    return authorization;
}