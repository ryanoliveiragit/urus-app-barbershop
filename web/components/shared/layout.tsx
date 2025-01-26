import { ReactNode } from "react"

interface Layout {
    children: ReactNode
}

export const Layout = ({children}: Layout) => {
    return (
        <main className="p-5">{children}</main>
    )
}