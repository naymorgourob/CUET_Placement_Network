import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResourceCoverImage } from '@/components/shared/ResourceCoverImage';
import { getResourceCategory } from '@/utils/resourceCategories';

export function ResourceCard({ resource }) {
  const category = getResourceCategory(resource.category);

  return (
    <Link to={`/resources/${resource.slug}`} className="block h-full">
      <Card
        interactive
        className="group flex h-full flex-col overflow-hidden border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30"
      >
        <div className="aspect-[16/9] w-full shrink-0 overflow-hidden">
          <ResourceCoverImage coverImagePath={resource.coverImagePath} category={resource.category} />
        </div>
        <CardBody className="flex flex-1 flex-col p-5">
          <Badge variant="default" icon={null} className="w-fit">
            {category.label}
          </Badge>
          <h3 className="mt-3 line-clamp-2 text-base font-semibold text-text transition-colors group-hover:text-primary">
            {resource.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">{resource.excerpt}</p>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
            {resource.readingTimeMinutes ? (
              <span className="flex items-center gap-1 text-text-muted">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                {resource.readingTimeMinutes} min read
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1 font-medium text-primary">
              Read
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
