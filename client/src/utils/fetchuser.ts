import { BackendResponse } from "@/interfaces/BackendResponse";
import { supabase } from "./UserContext";
import { User } from "./types";

const getUser = async () => {
  const user = await supabase.auth.getUser().then((res) => res.data.user);

  const response = await fetch(
    `${process.env.SERVER_URL}/user?email=${user!.email!}`
  ).then(async (res) => {
    const { data } = (await res.json()) as BackendResponse<User>;
    console.log(data);
    return data;
  });
  return response;
};

export default getUser;
