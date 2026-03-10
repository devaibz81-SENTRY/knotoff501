"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, Users, ListPlus, Receipt, LayoutDashboard, LogOut } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    href: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: ListPlus,
  },
  {
    title: "Bookings & Receipts",
    href: "/admin/bookings",
    icon: Receipt,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  const handleLogout = async () => {
     try {
       await fetch("/api/auth/logout", { method: "POST" })
       router.push("/admin/login")
       router.refresh()
     } catch(e) {}
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-[#00A3A8]">
            <span className="text-xl">Knotoff501</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarNavItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900",
                    pathname === item.href ? "bg-slate-100 text-slate-900" : ""
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-auto">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 shadow-sm">
          <div className="w-full flex-1">
             <h1 className="text-lg font-semibold md:text-2xl text-slate-800">
                {sidebarNavItems.find(item => item.href === pathname)?.title || "Dashboard"}
             </h1>
          </div>
        </header>
        <div className="flex-1 p-4 lg:p-6 lg:pt-8 relative overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
