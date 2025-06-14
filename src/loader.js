import {supabase} from "./supabaseClient.js";

export const inventoryLoader = async () => {
  const { data } = await supabase.from("inventories").select();
  return data;
}

export const inventoryDetailLoader = async ({params}) => {
  const { data } = await supabase.from("inventories").select().eq('id', params.id);
  return data[0];
}