import { Children } from "react"

interface DocumentLayoutPorps{
  children: React.ReactNode
}

const DocumentLayout = ({children} :DocumentLayoutPorps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <nav className="w-full bg-red-500">Document navbar</nav>
      {children}
      </div>
  )
}

export default DocumentLayout