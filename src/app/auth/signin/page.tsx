"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h1>Sign In</h1>
      
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "8px", 
              marginTop: "5px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: "8px", 
              marginTop: "5px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div style={{ textAlign: "center", margin: "10px 0" }}>
        OR
      </div>

      <button
        onClick={handleGoogleSignIn}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#db4437",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        Sign in with Google
      </button>

      <p style={{ textAlign: "center" }}>
        Don't have an account? <Link href="/auth/signup">Sign up</Link>
      </p>
    </div>
  )
}