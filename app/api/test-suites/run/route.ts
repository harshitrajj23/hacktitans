// app/api/test-suites/run/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Test suite id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("test_suites")
      .update({
        status: "pass", // fake success
        last_run_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("Error updating test suite", error);
      return NextResponse.json(
        { error: error?.message ?? "Failed to update suite" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}