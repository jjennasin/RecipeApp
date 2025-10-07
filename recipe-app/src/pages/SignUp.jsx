import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErr(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      nav('/account')
    } catch (e) { setErr(e.message) }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: '40px auto', display:'grid', gap:12 }}>
      <h1>Sign up</h1>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
      <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Create account</button>
      {err && <div style={{ color:'crimson' }}>{err}</div>}
      <div>Already have an account? <Link to="/signin">Sign in</Link></div>
    </form>
  )
}
