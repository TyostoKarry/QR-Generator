import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // In production, replace with your actual domain
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
// Handle OPTIONS requests (preflight)
function handleOptions(req) {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
}
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const preflightResponse = handleOptions(req);
  if (preflightResponse) return preflightResponse;
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Create a Supabase client with the service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );
    // Get the user ID from the JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid user token",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    const userId = user.id;
    // Delete user data from any related tables and storages first
    // Retrieve user files metadata
    const { data: userFilesMetadata, error: userFilesMetadataFetchError } =
      await supabaseAdmin.from("user_files").select("*").eq("user_id", userId);
    if (userFilesMetadataFetchError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: userFilesMetadataFetchError.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Delete user files from qr-files storage
    if (userFilesMetadata && userFilesMetadata.length > 0) {
      // Extract file paths from the metadata
      const filePaths = userFilesMetadata.map((file) => file.file_name);
      const { error: fileDeleteError } = await supabaseAdmin.storage
        .from("qr-files")
        .remove(filePaths);
      if (fileDeleteError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: fileDeleteError.message,
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
    // Delete user files metadata from user_files table
    const { error: userFilesMetadataError } = await supabaseAdmin
      .from("user_files")
      .delete()
      .eq("user_id", userId);
    if (userFilesMetadataError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: userFilesMetadataError.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Delete the user from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );
    if (deleteError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: deleteError.message,
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Handle any unexpected errors
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
