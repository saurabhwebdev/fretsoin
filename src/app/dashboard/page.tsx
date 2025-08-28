"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) router.push("/auth/signin") // Not authenticated
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "1px solid #ccc"
      }}>
        <h1>Dashboard</h1>
        <div>
          <span style={{ marginRight: "10px" }}>
            Welcome, {session.user?.name || session.user?.email}!
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "20px"
        }}>
          <div style={{ 
            padding: "20px", 
            border: "1px solid #ccc", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <h3>Clients</h3>
            <p style={{ fontSize: "24px", color: "#0070f3" }}>Coming Soon</p>
            <p>Manage your clients here</p>
          </div>

          <div style={{ 
            padding: "20px", 
            border: "1px solid #ccc", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <h3>Quotes</h3>
            <p style={{ fontSize: "24px", color: "#0070f3" }}>Coming Soon</p>
            <p>Create and manage quotes</p>
          </div>

          <div style={{ 
            padding: "20px", 
            border: "1px solid #ccc", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <h3>Services</h3>
            <p style={{ fontSize: "24px", color: "#0070f3" }}>Coming Soon</p>
            <p>Manage your services and products</p>
          </div>

          <div style={{ 
            padding: "20px", 
            border: "1px solid #ccc", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <h3>Reports</h3>
            <p style={{ fontSize: "24px", color: "#0070f3" }}>Coming Soon</p>
            <p>GST reports and analytics</p>
          </div>
        </div>

        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h2>🚧 Under Development 🚧</h2>
          <p>This is a placeholder dashboard. Features will be added soon!</p>
          <p><strong>Coming Features:</strong></p>
          <ul style={{ textAlign: "left", maxWidth: "400px", margin: "10px auto" }}>
            <li>Client Management</li>
            <li>Quote Generation with GST</li>
            <li>Service & Product Catalog</li>
            <li>GST Compliance Reports</li>
            <li>User Profile Management</li>
          </ul>
        </div>
      </main>
    </div>
  )
}