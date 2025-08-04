"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogIn, Menu, X } from "lucide-react"
import { useAuth } from "./auth-context"
import { useState } from "react"

export function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleBookingClick = () => {
    closeMobileMenu()
    router.push('/booking')
  }

  // const navigationLinks = [
  //   { href: "/", label: "Home" },
  //   { href: "/about", label: "About" },
  //   { href: "/services", label: "Services" },
  //   { href: "/contact", label: "Contact" }
  // ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-lg sm:text-xl">KnoVan</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {/* <div className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div> */}

          {/* Desktop Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">

            <Button onClick={handleBookingClick} className="flex items-center gap-2">
                Booking
            </Button>

            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                                {user.firstName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {user.role === "admin" && (
                            <DropdownMenuItem>
                                <Link href="/dashboard">
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                            <Link href="/profile">
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button onClick={onLoginClick} className="flex items-center gap-2">
                    Login / Signup
                </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              {/* <div className="space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div> */}

              {/* Mobile Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleBookingClick}
                >
                  Book Now
                </Button>
                
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {user.role === "admin" && (
                        <Link
                          href="/dashboard"
                          className="block py-2 px-3 text-sm transition-colors hover:bg-muted rounded-md"
                          onClick={closeMobileMenu}
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="block py-2 px-3 text-sm transition-colors hover:bg-muted rounded-md"
                        onClick={closeMobileMenu}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          closeMobileMenu()
                        }}
                        className="w-full text-left py-2 px-3 text-sm transition-colors hover:bg-muted rounded-md text-red-600 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      onLoginClick()
                      closeMobileMenu()
                    }} 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login / Signup
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 