import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  slug?: string;
  isCurrent: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={`text-[15px] text-gray-400 ${className}`}>
      {items.map((item, index) => (
        <span key={index}>
          {item.slug ? (
            <>
            <Link href="/">Trang chủ / </Link>
            <Link
              href={item.slug}
              className="hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
            </>
          ) : (
            <span className={item.isCurrent ? "text-blue-500" : ""}>
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