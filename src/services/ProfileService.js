import { supabase } from "../supabaseClient";

class ProfileService {
  async getMyAccount(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  }
}

export default new ProfileService();
