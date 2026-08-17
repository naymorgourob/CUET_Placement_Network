import { Link } from 'react-router-dom';
import { Briefcase, ArrowUpRight } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CompanyLogo } from '@/components/shared/CompanyLogo';

export function StudentCompanyCard({ company }) {
  return (
    <Link to={`/student/companies/${company.companyId}`} className="block h-full">
      <Card
        interactive
        className="group h-full border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30"
      >
        <CardBody className="flex h-full flex-col p-6">
          <div className="flex items-start gap-3">
            <CompanyLogo name={company.name} logoPath={company.logoPath} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-text transition-colors group-hover:text-primary">
                {company.name}
              </h3>
              {company.industry && <p className="mt-0.5 truncate text-sm text-text-muted">{company.industry}</p>}
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>

          {company.description && (
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-text-muted">{company.description}</p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <Badge variant={company.openJobCount > 0 ? 'success' : 'default'} icon={Briefcase}>
              {company.openJobCount} {company.openJobCount === 1 ? 'Open Job' : 'Open Jobs'}
            </Badge>
            <span className="ml-auto text-sm font-medium text-primary">View Company</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
