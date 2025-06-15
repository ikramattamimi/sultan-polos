import { supabase } from "./supabaseClient.js";

export const inventoryLoader = async () => {
  try {
    const { data, error } = await supabase.from("inventories").select();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in inventoryLoader:", error);
    throw error;
  }
};

export const inventoryDetailLoader = async ({ params }) => {
  try {
    const { data, error } = await supabase
      .from("inventories")
      .select()
      .eq("id", params.id);
    if (error) {
      throw error;
    }
    return data[0];
  } catch (error) {
    console.error("Error in inventoryDetailLoader:", error);
    throw error;
  }
};

// KONVEKSI
export const convectionLoader = async () => {
  try {
    const { data, error } = await supabase.from("convections").select();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in convectionLoader:", error);
    throw error;
  }
};

export const convectionDetailLoader = async ({ params }) => {
  try {
    const { data, error } = await supabase
      .from("convections")
      .select()
      .eq("id", params.id);
    if (error) {
      throw error;
    }
    return data[0];
  } catch (error) {
    console.error("Error in convectionDetailLoader:", error);
    throw error;
  }
};