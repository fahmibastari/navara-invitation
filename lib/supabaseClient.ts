// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars are missing")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadImage(
  file: File,
  folder: string,
): Promise<string> {
  const ext = file.name.split(".").pop()
  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(data.path)

  return publicUrl
}
