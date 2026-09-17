"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Gamepad2 } from "lucide-react"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } =
      mode === "sign-up"
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (authError) {
      setError(
        mode === "sign-up"
          ? "Gagal membuat akun. Periksa data yang dimasukkan."
          : "Email atau password salah.",
      )
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 py-10">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Gamepad2 className="size-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Zero<span className="text-primary">Store</span>
        </span>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{mode === "sign-up" ? "Buat akun baru" : "Masuk ke akunmu"}</CardTitle>
          <CardDescription>
            {mode === "sign-up"
              ? "Daftar untuk mulai jual & beli akun game"
              : "Masuk untuk melanjutkan ke Zero Store"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {mode === "sign-up" && (
                <Field>
                  <FieldLabel htmlFor="name">Nama</FieldLabel>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Nama kamu"
                  />
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="kamu@email.com"
                />
              </Field>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                  placeholder="Minimal 8 karakter"
                  aria-invalid={!!error}
                />
                {error && <FieldDescription className="text-destructive">{error}</FieldDescription>}
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner data-icon="inline-start" />}
                  {mode === "sign-up" ? "Daftar" : "Masuk"}
                </Button>
                <FieldDescription className="text-center">
                  {mode === "sign-up" ? (
                    <>
                      Sudah punya akun?{" "}
                      <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
                        Masuk
                      </Link>
                    </>
                  ) : (
                    <>
                      Belum punya akun?{" "}
                      <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
                        Daftar
                      </Link>
                    </>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
