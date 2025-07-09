import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
Deno.serve(async (req) => {
  try {
    // Check for the secret key in the request headers
    const secretKey = req.headers.get("cron-secret-key");
    const expectedSecretKey = Deno.env.get("CRON_SECRET_KEY");
    if (!secretKey || secretKey !== expectedSecretKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized: Invalid or missing secret key",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // Fetch files from the `user_files` table that were updated more than 7 days ago
    const { data: oldFiles, error: fetchError } = await supabaseAdmin
      .from("user_files")
      .select("*")
      .lt("updated_at", sevenDaysAgo.toISOString());
    if (fetchError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: fetchError.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (!oldFiles || oldFiles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No files older than 7 days found.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Extract file paths from the metadata
    const filePaths = oldFiles.map((file) => file.file_name);
    // Delete files from the `qr-files` storage bucket
    const { error: storageDeleteError } = await supabaseAdmin.storage
      .from("qr-files")
      .remove(filePaths);
    if (storageDeleteError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: storageDeleteError.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Delete file metadata from the `user_files` table  (should be done via functions and triggers after deleting files from storage but doing it here to be sure)
    const { error: metadataDeleteError } = await supabaseAdmin
      .from("user_files")
      .delete()
      .lt("updated_at", sevenDaysAgo.toISOString());
    if (metadataDeleteError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: metadataDeleteError.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Old files and metadata deleted successfully.",
      }),
      {
        status: 200,
        headers: {
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
          "Content-Type": "application/json",
        },
      }
    );
  }
});
