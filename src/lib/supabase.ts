import { createClient } from "@supabase/supabase-js";
import { TABLE } from "./theme";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

export type Application = {
  wallet: string;
  twitter: string;
  quote_url: string;
  comment_url: string;
};

export async function submitApplication(row: Application) {
  return supabase.from(TABLE).insert([
    {
      wallet: row.wallet.trim().toLowerCase(),
      twitter: row.twitter.trim().replace(/^@/, ""),
      quote_url: row.quote_url.trim(),
      comment_url: row.comment_url.trim(),
    },
  ]);
}
