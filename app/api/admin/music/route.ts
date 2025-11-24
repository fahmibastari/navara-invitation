import { NextResponse } from "next/server";
// Import supabase dari client Anda yang menggunakan Anon Key
import { supabase } from "@/lib/supabaseClient"; 
import prisma from "@/lib/prisma";

// Helper function untuk mendapatkan path penyimpanan dari URL publik (tetap penting untuk DELETE)
function getFilePathFromUrl(publicUrl: string): string | null {
  try {
    const urlObject = new URL(publicUrl);
    const pathSegments = urlObject.pathname.split('/');
    
    const publicIndex = pathSegments.indexOf('public');
    
    if (publicIndex !== -1 && pathSegments.length > publicIndex + 1) {
      // Mengembalikan path dari <bucket_name>/<file_path>
      // Kita perlu memastikan path yang dikembalikan adalah: audio/file-name.mp3
      // Kita cari index 'audio'
      const audioIndex = pathSegments.indexOf('audio');
      if (audioIndex !== -1) {
         return pathSegments.slice(audioIndex).join('/');
      }
    }
  } catch (error) {
    console.error("URL parsing error:", error);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File; 

    if (!file) {
      return NextResponse.json({ error: "No file uploaded (Check formData key: 'audio')" }, { status: 400 });
    }

    const fileName = file.name.replace(/\s/g, "_"); 
    // Path di dalam bucket 'audio'
    const filePath = `${Date.now()}-${fileName}`; 

    // ✅ PERBAIKAN: Targetkan bucket "audio"
    const { data, error } = await supabase.storage
      .from("audio") 
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false 
      });

    if (error) {
      console.error("Supabase Upload Error:", error.message);
      
      if (error.message.includes("Policy rejected")) {
          // Pesan lebih jelas jika RLS gagal
          return NextResponse.json({ error: "Upload failed: Supabase Storage Policy rejected. Check your RLS INSERT policy for the 'audio' bucket to allow public access (anon role)." }, { status: 500 });
      }
      return NextResponse.json({ error: "Supabase upload failed: " + error.message }, { status: 500 });
    }

    // ✅ PERBAIKAN: Targetkan bucket "audio"
    const publicUrl = supabase.storage.from("audio").getPublicUrl(data.path).data.publicUrl;

    const savedMusic = await prisma.music.create({
      data: {
        url: publicUrl,
      },
    });

    return NextResponse.json(savedMusic);
  } catch (err) {
    console.error("General POST Error:", err);
    return NextResponse.json({ error: "Internal Server Error during upload." }, { status: 500 });
  }
}

// ... GET, PUT functions ...

export async function GET() {
  const musicList = await prisma.music.findMany();
  return NextResponse.json(musicList);
}

export async function PUT(req: Request) {
  const { id, url } = await req.json();

  if (!id || !url) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updatedMusic = await prisma.music.update({
    where: { id },
    data: {
      url, 
    },
  });

  return NextResponse.json(updatedMusic);
}

export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const music = await prisma.music.findUnique({
      where: { id: Number(id) },
    });

    if (!music) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }
    
    const filePathToDelete = getFilePathFromUrl(music.url);

    if (!filePathToDelete) {
      console.error("Failed to parse file path from URL:", music.url);
    } else {
        // ✅ PERBAIKAN: Targetkan bucket "audio"
        const { error: deleteError } = await supabase.storage 
          .from("audio")
          .remove([filePathToDelete]);
    
        if (deleteError) {
          console.error("Supabase Delete Error:", deleteError.message);
        }
    }

    await prisma.music.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Music deleted successfully" });
  } catch (err) {
    console.error("General DELETE Error:", err);
    return NextResponse.json({ error: "Internal Server Error during deletion." }, { status: 500 });
  }
}