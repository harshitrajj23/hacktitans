import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, baseUrl, endpoints } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // 1) create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        base_url: baseUrl,
      })
      .select()
      .single();

    if (projectError || !project) {
      console.error(projectError);
      return NextResponse.json(
        { error: projectError?.message ?? 'Failed to create project' },
        { status: 500 }
      );
    }

    // 2) insert endpoints if provided
    if (Array.isArray(endpoints) && endpoints.length > 0) {
      const rows = endpoints.map((e: any) => ({
        project_id: project.id,
        method: e.method,
        path: e.path,
        status_code: e.statusCode ?? 200,
        response_json: e.responseJson,
      }));

      const { error: endpointsError } = await supabase
        .from('endpoints')
        .insert(rows);

      if (endpointsError) {
        console.error(endpointsError);
        return NextResponse.json(
          { error: endpointsError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { projectId: project.id, project },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Unexpected error while creating project' },
      { status: 500 }
    );
  }
}