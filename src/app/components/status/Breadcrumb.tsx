import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  slug?: string;
  isCurrent: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-6 text-sm text-gray-400">
      {items.map((item, index) => (
        <span key={index}>
          {item.slug ? (
            <Link
              href={item.slug}
              className="hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className={item.isCurrent ? "text-primary" : ""}>
              {item.name}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="mx-2 text-gray-500">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}