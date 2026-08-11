"use client"

import { useActionState } from "react"
import { cn } from "@/lib/utils"
import { login, type LoginFormState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const initialState: LoginFormState = {
  error: null,
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader>
          <span className="section-eyebrow">Akses terbatas</span>
          <CardTitle className="display-title mt-3 text-4xl text-primary">Masuk ke dashboard.</CardTitle>
          <CardDescription>
            Gunakan akun admin Supabase yang telah terdaftar untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            {state?.error && (
              <div role="alert" className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@riswandiwedding.com"
                  autoComplete="email"
                  disabled={pending}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  disabled={pending}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={pending} aria-busy={pending} className="w-full">
                  {pending ? "Memverifikasi..." : "Masuk ke Dashboard"}
                </Button>
                <FieldDescription className="text-center">
                  Hanya akun dengan peran admin atau super admin yang dapat masuk.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
