import{ createContext, useContext, useEffect, useState} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import {auth } from '../lib/firebase'

const Ctx = createContext({ user: null, loading: true})
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => onAuthStateChanged(auth, u => {setUser(u); setLoading(false) }), [])
    return <Ctx.Provider value={{ user, loading}}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)