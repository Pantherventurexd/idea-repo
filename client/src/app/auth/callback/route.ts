import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import fs from "fs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

function logToFile(message: string) {
  const logPath = path.join(process.cwd(), "auth-debug.log");
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `${timestamp}: ${message}\n`);
}

export async function GET(request: NextRequest) {
  logToFile(`Auth callback route hit: ${request.url}`);

  // Get code from URL instead of store
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  logToFile(`Code parameter present: ${code ? "Yes" : "No"}`);

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    logToFile("Exchanging code for session...");
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      logToFile(
        `Exchange complete: ${error ? `Error: ${error.message}` : "Success"}`
      );
      logToFile(`Session data exists: ${data && data.session ? "Yes" : "No"}`);

      if (error) {
        logToFile(
          `Error exchanging code for session: ${JSON.stringify(error)}`
        );
        return NextResponse.redirect(
          new URL("/?authError=supabase", request.url)
        );
      }

      if (data.session) {
        logToFile("Session obtained, attempting backend call...");
        try {
          const backendUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
          logToFile(`Backend URL: ${backendUrl}`);

          // Add this line to see if the code is being executed
          logToFile("About to make fetch request to backend");

          const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.session.access_token}`,
            },
          });

          logToFile(`Fetch response status: ${response.status}`);

          if (!response.ok) {
            const errorText = await response.text();
            logToFile(`Failed to register user with backend: ${errorText}`);
            return NextResponse.redirect(
              new URL("/?authError=backend", request.url)
            );
          }

          const responseData = await response.json();
          logToFile(
            `Backend registration successful: ${JSON.stringify(responseData)}`
          );

          return NextResponse.redirect(
            new URL("/?authSuccess=true", request.url)
          );
        } catch (err) {
          logToFile(
            `Error sending user data to backend: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
          return NextResponse.redirect(
            new URL("/?authError=connection", request.url)
          );
        }
      }
    } catch (error) {
      logToFile(`Error exchanging code for session: ${JSON.stringify(error)}`);
      return NextResponse.redirect(
        new URL("/?authError=supabase", request.url)
      );
    }
  }

  logToFile("Fallback redirect happening");
  return NextResponse.redirect(new URL("/", request.url));
}
