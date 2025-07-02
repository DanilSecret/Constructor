import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserData = {
    uuid: string;
    role: string;
    email: string;
} | null;

type UserState = {
    isAuth: boolean;
    userData: UserData;
    hydrated: boolean;
    setIsAuth: (auth: boolean) => void;
    setUserData: (data: UserData) => void;
    setHydrated: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isAuth: false,
            userData: null,
            hydrated: false,
            setIsAuth: (auth) => set({ isAuth: auth }),
            setUserData: (data) => set({ userData: data }),
            setHydrated: () => set({ hydrated: true }),
        }),
        {
            name: "userdata-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated?.();
            },
        }
    )
);