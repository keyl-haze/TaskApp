"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/actions/auth"


export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(formData)
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  )
}
