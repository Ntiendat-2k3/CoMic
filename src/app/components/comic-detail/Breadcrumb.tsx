import Link from "next/link"

interface BreadcrumbItem {
  name: string
  slug?: string
  isCurrent: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className="text-sm text-gray-400">
    {items.map((item, index) => (
      <div key={`breadcrumb-${item.name}-${index}-${item.slug || "current"}`} className="inline-flex items-center">
        {item.slug ? (
          <Link href={item.slug} className="hover:text-blue-400 transition-colors duration-200">
            {item.name}
          </Link>
        ) : (
          <span className="text-blue-400">{item.name}</span>
        )}
        {index < items.length - 1 && <span className="mx-2 text-gray-500">/</span>}
      </div>
    ))}
  </nav>
)

export default Breadcrumb
