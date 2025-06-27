from fastapi import FastAPI, Request
import httpx

app = FastAPI(title="IHMS API Gateway")

# Define backend service URLs
SERVICE_ROUTES = {
    "auth": "http://auth-service:8000",
    "inventory": "http://inventory-service:8001"
}

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(service: str, path: str, request: Request):
    if service not in SERVICE_ROUTES:
        return {"error": "Unknown service"}

    target_url = f"{SERVICE_ROUTES[service]}/{path}"

    async with httpx.AsyncClient() as client:
        method = request.method.lower()
        req_method = getattr(client, method)

        response = await req_method(
            target_url,
            headers=request.headers.raw,
            content=await request.body()
        )

    return {
        "status_code": response.status_code,
        "body": response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
    }
