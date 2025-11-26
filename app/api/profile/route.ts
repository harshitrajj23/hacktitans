import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const PROFILE_ID = 1; // single demo user for hackathon

export async function GET() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", PROFILE_ID)
    .maybeSingle();

  if (error) {
    console.error(error);
    // If no row yet, just return null
    return NextResponse.json(null, { status: 200 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, role, team } = body;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: PROFILE_ID,
        name,
        email,
        role,
        team,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}