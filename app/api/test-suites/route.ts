import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/test-suites?projectId=...
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  let query = supabase.from("test_suites").select("*").order("created_at", { ascending: false } as any);

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching test_suites", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// POST /api/test-suites
// body: { projectId, name, description }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, name, description } = body;

    if (!projectId || !name) {
      return NextResponse.json(
        { error: "projectId and name are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("test_suites")
      .insert({
        project_id: projectId,
        name,
        description,
        status: "never_run",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating test_suite", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in POST /api/test-suites", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}