import os
import jwt

from fastapi import (
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from jwt import PyJWKClient

AWS_REGION = os.getenv("AWS_REGION")

USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

if not USER_POOL_ID:
    raise RuntimeError("User Pool Id is missing")

ISSUER = (
    f"https://cognito-idp."
    f"{AWS_REGION}.amazonaws.com/"
    f"{USER_POOL_ID}"
)

JWKS_URL = (
    f"{ISSUER}/.well-known/jwks.json"
)

security = HTTPBearer(auto_error=False)

jwks_client = PyJWKClient(JWKS_URL)

def verify_access_token(token: str) -> dict:
    try:
        signing_key = (
            jwks_client.get_signing_key_from_jwt(token)
        )

        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=ISSUER,
            options={
                "verify_aud": False,
            },
        )

        # Cognito access tokens must explicitly identify themselves as access tokens
        if (claims.get("token_use") != "access"):
            raise ValueError("Invalid token use.")

        # Access tokens use client_id, not the ID-token and claim
        if (claims.get("client_id") != CLIENT_ID):
            raise ValueError("Invalid Cognito client")

        if not claims.get("sub"):
            raise ValueError("Token missing userId")

        return claims
    except Exception as error:
        print("Cognito token verification failed.", error)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

def require_user(
        credentials: HTTPAuthorizationCredentials | None = Depends(security)
) -> str:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    claims = (verify_access_token(credentials.credentials))

    return claims["sub"]
