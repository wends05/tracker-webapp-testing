import { createClient, Session } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";
import User from "../types/User";

interface IUserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  supabaseSession: Session | null;
}
export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
  supabaseSession: null,
});

export const supabase = createClient(
  "https://cjqudvdhgvyupoehxgfq.supabase.co",
  import.meta.env.VITE_SUPABASE_KEY!
);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (ev, session) => {
      console.log(user);
      setSupabaseSession(session);

      console.log(ev);
      if (ev == "SIGNED_IN") {
        const email = session!.user.email;

        console.log(email);
        try {
          const response = await fetch(`http://localhost:3000/user`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw Error(await response.json());
          }

          const dbUser = await response.json();
          console.log(dbUser);
          setUser(dbUser.data);
        } catch (error) {
          console.error("ERROR: ", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
    supabaseSession,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
