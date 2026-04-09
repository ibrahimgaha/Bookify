"use client"
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {SignInButton, SignUpButton, UserButton, Show, useUser} from '@clerk/nextjs'

const navItems = [
    {label: "Library", href: "/"},
    {label: "Add New", href: "/books/new"},
    // {label: "Pricing", href: "/pricing"},
    // {label: "Contact", href: "/contact"},
]


const Navbar = () => {
    const pathName = usePathname();
    const {user} = useUser();

  return (
    <header className="w-full fixed z-50 ('--bg-primary')">
      <div className='wrapper navbar height py-4 flex justify-between items-center'>
            <Link href="/" className='flex gap-0.5 items-baseline-last'>
                <Image src="/assets/logo.png" alt="Bookify" width={42} height={32} />
                <span className='logo-text'>Bookify</span>
            </Link>
            <nav className='w-fit flex gap-7.5 items-center'>
                {navItems.map(({ label, href }) => {
                    const isActive =
                        pathName === href ||
                        (href !== "/" && pathName.startsWith(href));

                    return (
                        <Link
                        href={href}
                        key={label}
                        className={cn('nav-link-base', isActive ? 'nav-link-active' :'text-black hover:opacity-70' )}
                        >
                        {label}
                        </Link>
                    );
                    })}
                <div className='flex gap-7.5 items-center'>
                    <Show when="signed-out">
                        <div className='nav-user-link'>
                            <SignInButton />
                        </div>

                        <SignUpButton />
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                        {user?.firstName && (<Link href="/subscriptions" className='nav-user-name'>
                            {user?.firstName}
                        </Link>
                        )}

                        </Show>
                </div>

            </nav>
      </div>
    </header>
  )
}

export default Navbar
