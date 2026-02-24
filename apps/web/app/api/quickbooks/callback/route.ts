import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const clientId = process.env.QUICKBOOKS_CLIENT_ID!;
const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET!;
const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI!;

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);

  const cookieStore = await cookies()

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = cookieStore.get("qb_oauth_state")?.value;

  if (!code) {
    return Response.json({ error: "Missing authorization code" }, { status: 400 });
  }

  if (!state || !storedState || state !== storedState) {
    return Response.json({ error: "Invalid state" }, { status: 400 });
  }

  cookieStore.delete("qb_oauth_state");

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    });

    const response = await fetch(
      "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token exchange failed:", errorText);
      return Response.json(
        { error: "Failed to exchange code for tokens" },
        { status: 500 }
      );
    }

    // const data = await response.json();

    // TODO:
    // - Save access_token + refresh_token in DB (encrypted)
    // - Associate with current user
    // - Store realmId if needed (QuickBooks also sends this in query params)

    // access_token: data.access_token,
    // refresh_token: data.refresh_token,
    // expires_in: data.expires_in

    return Response.redirect(
      "http://localhost:3000/dashboard/connect",
      302
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Callback error:", message, err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
