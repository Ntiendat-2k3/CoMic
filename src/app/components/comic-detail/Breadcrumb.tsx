import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  slug?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className="mb-6 text-sm text-gray-400 font-medium">
   {items.map((item, index) => (
      <div 
        key={`breadcrumb-${item.name}-${index}-${item.slug || 'current'}`}
        className="inline-flex items-center"
      >
        {item.slug ? (
          <Link
            href={item.slug}
            className="hover:text-primary-accent transition-colors duration-200"
          >
            {item.name}
          </Link>
        ) : (
          <span className="text-primary-accent">{item.name}</span>
        )}
        {index < items.length - 1 && (
          <span className="mx-2 text-gray-500">/</span>
        )}
      </div>
    ))}
  </nav>
);

export default Breadcrumb;