"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      } else {
        setError(data.error || "An error occurred")
      }
    } catch (error) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
        <h1>Success!</h1>
        <p>Account created successfully. Redirecting to sign in...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h1>Sign Up</h1>
      
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            minLength={6}
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p style={{ textAlign: "center" }}>
        Already have an account? <Link href="/auth/signin">Sign in</Link>
      </p>
    </div>
  )
}