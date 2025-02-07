import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createClient } from "@supabase/supabase-js";
import type { LoginInput, RegisterInput, User } from "../types/auth";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  updateUser: (newData: Partial<User>) => void; // ✅ Add this line
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Login function using Supabase
  const login = useCallback(async (data: LoginInput) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw new Error(error.message);
      if (!authData.user) throw new Error("Login failed");

      // Fetch user details from 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, bio, location, profile_image")
        .eq("id", authData.user.id)
        .single();

      if (userError) throw new Error(userError.message);

      // Create a new user object that includes all necessary fields
      const user: User = {
        ...authData.user,
        email: authData.user.email ?? "", // Ensure email is always defined
        name: userData?.name || "",
        location: userData?.location || "",
        bio: userData?.bio || "",
        profile_image: userData?.profile_image || "",
      };

      setUser(user); // ✅ Now TypeScript knows this matches `User | null`
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  // Register function using Supabase
  const register = useCallback(async (data: RegisterInput) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw new Error(error.message);
      if (!authData.user) throw new Error("Registration failed");

      // Ensure required properties are correctly defined
      const user: User = {
        ...authData.user,
        email: authData.user.email ?? data.email, // Ensure email is not undefined
        name: data.name,
        bio: "",
        profile_image: "",
      };

      // Add user to the database
      // Insert additional user data into the database
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: user.email,
          name: user.name,
          bio: user.bio,
          profile_image: user.profile_image,
        },
      ]);

      if (dbError) throw new Error(dbError.message);

      setUser(user);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  // Check if user is already authenticated on load
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("Error fetching user:", authError);
        setIsLoading(false);
        return;
      }

      if (!authData?.user) {
        setIsLoading(false);
        return;
      }

      // Fetch additional user details from 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, bio, profile_image")
        .eq("id", authData.user.id)
        .single();

      if (userError) {
        console.error("Error fetching user profile:", userError);
      }

      // Create a full user object
      const user: User = {
        ...authData.user,
        email: authData.user.email ?? "", // Ensure email is always defined
        name: userData?.name || "",
        bio: userData?.bio || "",
        profile_image: userData?.profile_image || "",
      };

      setUser(user); // ✅ Now it matches `User | null`
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const updateUser = (newData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null; // Ensure we don't update if there's no user

      return { ...prevUser, ...newData } as User;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
