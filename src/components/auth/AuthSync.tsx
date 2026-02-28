"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/features/userSlice";
import { setClients, setLoading, setError } from "@/store/features/clientSlice";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = (session.user as { id?: string }).id ?? null;

      dispatch(
        setUser({
          id: userId,
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        }),
      );

      // Fetch clients owned by this user
      if (userId) {
        dispatch(setLoading(true));
        fetch(`/api/clients?assignedToId=${userId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch clients");
            return res.json();
          })
          .then((data) => {
            dispatch(setClients(data.clients ?? []));
          })
          .catch((err) => {
            console.error("Error fetching clients:", err);
            dispatch(setError(err.message ?? "Failed to fetch clients"));
          });
      }
    }

    if (status === "unauthenticated") {
      dispatch(clearUser());
      dispatch(setClients([]));
    }
  }, [session, status, dispatch]);

  return null;
}
