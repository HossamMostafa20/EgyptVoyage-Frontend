"use client"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { UserIcon } from "lucide-react"
import { getToken, clearToken } from "@/lib/authToken"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button"

export default function Navbar() {

    const [open, setOpen] = useState(false);

    // const menuRef = useRef<HTMLDivElement>(null);
    // useEffect(() => {
    //     function handleClickOutside(e: MouseEvent) {
    //         if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
    //             setOpen(false)
    //         }
    //     }
    //     if (open) {
    //         document.addEventListener("mousedown", handleClickOutside)
    //     }
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside)
    //     }
    // }, [open, setOpen])

    const router = useRouter();
    const { isLoggedIn, logout } = useAuth();

    function handleLogout() {
        logout();
        router.replace("/");
    }

    return <>
        <nav className="py-3 px-4 sm:px-0 sticky top-0 z-50 bg-[#F8DA9A] text-[#0D3B66] shadow">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">

                    <Link href={'/'}>
                        <div className="flex items-center">
                            <Image src="/logo.png" alt="Logo" className="w-10 me-1.5" width={80} height={80} />
                            <h1 onClick={() => setOpen(false)} className="text-lg font-bold">Egypt Voyage</h1>
                        </div>
                    </Link>

                    <div className="order-first lg:order-0">
                        <NavigationMenu className="hidden lg:flex">
                            <NavigationMenuList>

                                <NavigationMenuItem>
                                    <NavigationMenuLink className="font-semibold" asChild>
                                        <Link href={'/home'}>Home</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink className="font-semibold" asChild>
                                        <Link href={'/hotel'}>Hotels</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink className="font-semibold" asChild>
                                        <Link href={'/landmark'}>Landmarks</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink className="font-semibold" asChild>
                                        <Link href={'/restaurant'}>Restaurants</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink className="font-semibold" asChild>
                                        <Link href={'/program'}>Programs</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="cursor-pointer -ms-0.5 hover:bg-[#0D3B66] hover:text-white focus-visible:outline-none focus-visible:ring-0 focus:outline-none">
                                            Virtual Tours
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className=" bg-[#0D3B66]/85 backdrop-blur-md text-[#F8DA9A] border border-white/20 shadow-2xl rounded-xl">
                                        <DropdownMenuGroup>
                                            <Link href={'https://mpembed.com/show/?m=sgMWWDvdKsV&mpu=497'}>
                                                <DropdownMenuItem className="cursor-pointer">Abu Simbel Temple</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://my.matterport.com/show/?m=BsXpwTSYSyN'}>
                                                <DropdownMenuItem className="cursor-pointer">Wahty Tomb</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://my.matterport.com/show/?m=PKxweZaPG3P'}>
                                                <DropdownMenuItem className="cursor-pointer">Niankh-khnum & Khnumhotep Tomb</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://my.matterport.com/show/?m=xmDbt2rfa82'}>
                                                <DropdownMenuItem className="cursor-pointer">Mehu Tomb</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://my.matterport.com/show/?m=vLYoS66CWpk'}>
                                                <DropdownMenuItem className="cursor-pointer">Tomb of Menna</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://arce.org/theban-tombs-286-and-159/'}>
                                                <DropdownMenuItem className="cursor-pointer">Theban Tombs</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://mpembed.com/show/?m=yMMHWqMJZbY'}>
                                                <DropdownMenuItem className="cursor-pointer">Coptic Museum</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://mpembed.com/show/?m=LCyv1zFUxiq'}>
                                                <DropdownMenuItem className="cursor-pointer">Gayer-Anderson Museum</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://arce.org/bab-zuwayla/'}>
                                                <DropdownMenuItem className="cursor-pointer">Bab Zuwayla Museum</DropdownMenuItem>
                                            </Link>

                                            <Link href={'https://arce.org/museum-monastery-st-anthony/'}>
                                                <DropdownMenuItem className="cursor-pointer">Monastery of St. Anthony Museum</DropdownMenuItem>
                                            </Link>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </NavigationMenuList>
                        </NavigationMenu>
                        <svg onClick={() => setOpen(!open)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="lg:hidden size-7 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>

                    {/* <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href={'/wishlist'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0D3B66" className="size-9">
                                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                    </svg>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href={'/settings'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0D3B66" className="size-9">
                                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                                    </svg>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href={'/about'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0D3B66" className="size-9">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                    </svg>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href={'/login'}>Login</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href={'/signup'}>SignUp</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu> */}

                    <div className="flex">
                        <div onClick={() => setOpen(false)} className="me-2.5">
                            <Link href={'/wishlist'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0D3B66" className="size-7">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                            </Link>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-0"><UserIcon className="cursor-pointer" /></DropdownMenuTrigger>
                            <DropdownMenuContent className=" bg-[#0D3B66]/85 backdrop-blur-md text-[#F8DA9A] border border-white/20 shadow-2xl rounded-xl">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {!isLoggedIn ? (
                                        <>
                                            <Link onClick={() => setOpen(false)} href="/login">
                                                <DropdownMenuItem className="cursor-pointer font-semibold">
                                                    Login
                                                </DropdownMenuItem>
                                            </Link>

                                            <Link onClick={() => setOpen(false)} href="/signup">
                                                <DropdownMenuItem className="cursor-pointer font-semibold">
                                                    SignUp
                                                </DropdownMenuItem>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link onClick={() => setOpen(false)} href="/profile">
                                                <DropdownMenuItem className="cursor-pointer font-semibold">
                                                    Profile
                                                </DropdownMenuItem>
                                            </Link>

                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setOpen(false)
                                                    handleLogout()
                                                }}
                                                className="cursor-pointer font-semibold"
                                            >
                                                Logout
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* {open ? <NavigationMenu ref={menuRef} className="lg:hidden">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="font-semibold mb-0.5" asChild>
                                <Link onClick={() => setOpen(false)} href={'/home'}>Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="font-semibold mb-0.5" asChild>
                                <Link onClick={() => setOpen(false)} href={'/hotel'}>Hotel</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="font-semibold mb-0.5" asChild>
                                <Link onClick={() => setOpen(false)} href={'/landmark'}>Landmark</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="font-semibold mb-0.5" asChild>
                                <Link onClick={() => setOpen(false)} href={'/program'}>Program</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="font-semibold" asChild>
                                <Link onClick={() => setOpen(false)} href={'/restaurant'}>Restaurant</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu> : ''} */}

                <AnimatePresence>
                    {open && (
                        <motion.div
                            // ref={menuRef}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden lg:hidden"
                        >
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col gap-1 items-">

                                    <NavigationMenuItem>
                                        <NavigationMenuLink className="font-semibold" asChild>
                                            <Link onClick={() => setOpen(false)} href="/hotel">Hotels</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuLink className="font-semibold" asChild>
                                            <Link onClick={() => setOpen(false)} href="/landmark">Landmarks</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuLink className="font-semibold" asChild>
                                            <Link onClick={() => setOpen(false)} href="/restaurant">Restaurants</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuLink className="font-semibold" asChild>
                                            <Link onClick={() => setOpen(false)} href="/program">Programs</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="cursor-pointer -ms-0.5 hover:bg-[#0D3B66] hover:text-white focus-visible:outline-none focus-visible:ring-0 focus:outline-none">
                                                Virtual Tours
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className=" bg-[#0D3B66]/85 backdrop-blur-md text-[#F8DA9A] border border-white/20 shadow-2xl rounded-xl">
                                            <DropdownMenuGroup>
                                                <Link href={'https://mpembed.com/show/?m=sgMWWDvdKsV&mpu=497'}>
                                                    <DropdownMenuItem className="cursor-pointer">Abu Simbel Temple</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://my.matterport.com/show/?m=BsXpwTSYSyN'}>
                                                    <DropdownMenuItem className="cursor-pointer">Wahty Tomb</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://my.matterport.com/show/?m=PKxweZaPG3P'}>
                                                    <DropdownMenuItem className="cursor-pointer">Niankh-khnum & Khnumhotep Tomb</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://my.matterport.com/show/?m=xmDbt2rfa82'}>
                                                    <DropdownMenuItem className="cursor-pointer">Mehu Tomb</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://my.matterport.com/show/?m=vLYoS66CWpk'}>
                                                    <DropdownMenuItem className="cursor-pointer">Tomb of Menna</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://arce.org/theban-tombs-286-and-159/'}>
                                                    <DropdownMenuItem className="cursor-pointer">Theban Tombs</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://mpembed.com/show/?m=yMMHWqMJZbY'}>
                                                    <DropdownMenuItem className="cursor-pointer">Coptic Museum</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://mpembed.com/show/?m=LCyv1zFUxiq'}>
                                                    <DropdownMenuItem className="cursor-pointer">Gayer-Anderson Museum</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://arce.org/bab-zuwayla/'}>
                                                    <DropdownMenuItem className="cursor-pointer">Bab Zuwayla Museum</DropdownMenuItem>
                                                </Link>

                                                <Link href={'https://arce.org/museum-monastery-st-anthony/'}>
                                                    <DropdownMenuItem className="cursor-pointer">Monastery of St. Anthony Museum</DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </NavigationMenuList>
                            </NavigationMenu>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    </>
}
