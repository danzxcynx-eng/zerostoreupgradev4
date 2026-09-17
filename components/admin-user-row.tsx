"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { toggleUserBan } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"

export function AdminUserRow({
  user,
}: {
  user: { id: string; name: string; email: string; role: string; banned: boolean | null }
}) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleUserBan(user.id, !user.banned)
      toast.success(user.banned ? "Pengguna diaktifkan kembali" : "Pengguna diblokir")
    })
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
      </TableCell>
      <TableCell>
        {user.banned ? <Badge variant="destructive">Diblokir</Badge> : <Badge variant="outline">Aktif</Badge>}
      </TableCell>
      <TableCell className="text-right">
        {user.role !== "admin" && (
          <Button size="sm" variant={user.banned ? "outline" : "destructive"} onClick={handleToggle} disabled={pending}>
            {user.banned ? "Aktifkan" : "Blokir"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
