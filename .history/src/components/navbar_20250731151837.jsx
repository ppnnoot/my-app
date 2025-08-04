"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

import { LogIn } from "lucide-react"
import { useAuth } from "./auth-context"

export function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-xl">KnoVan</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link 
              href="/services" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button onClick={onLoginClick} className="flex items-center gap-2">
              Login / Signup
            </Button>
            <Button asChild>
            <Link href="/booking" className="flex items-center gap-2">
                Booking
              </Link>
            </Button>
            {user && (
                <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                        {user.firstName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <Button onClick={logout} className="flex items-center gap-2">
                    Logout
                </Button>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  )
} 