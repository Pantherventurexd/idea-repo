import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL("/?authError=supabase", request.url)
      );
    }

    if (data.session) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

        try {
            console.log("Testing backend connection...");
            const testResponse = await fetch(`${backendUrl}/auth/test`, {
              method: "GET"
            });
            console.log("Test endpoint response:", testResponse.status);
          } catch (testErr) {
            console.error("Error testing backend connection:", testErr);
          }
        console.log("Sending user data to backend:", {
          url: `${backendUrl}/auth/login`,
          userId: data.session.user.id,
          provider: data.session.user.app_metadata.provider
        });
        

        const response = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({
            token: data.session.access_token,
            user: data.session.user,
            provider: data.session.user.app_metadata.provider || "oauth",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to register user with backend:", errorText);
          return NextResponse.redirect(
            new URL("/?authError=backend", request.url)
          );
        }

        const responseData = await response.json();
        console.log("Backend registration successful:", responseData);
        
        return NextResponse.redirect(new URL("/?authSuccess=true", request.url));
      } catch (err) {
        console.error("Error sending user data to backend:", err);
        return NextResponse.redirect(
          new URL("/?authError=connection", request.url)
        );
      }
    }
  }

  // If we get here, there's either no code or other issue
  return NextResponse.redirect(new URL("/", request.url));
}