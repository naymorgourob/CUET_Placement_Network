import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardCheck, Award, Building2, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableEmptyState,
  TableLoadingState,
} from '@/components/ui/Table';
import { useToast } from '@/hooks/useToast';
import { useAdminReports } from '@/features/admin/adminQueries';
import * as adminService from '@/features/admin/adminService';

function StatCard({ icon: Icon, label, value, isLoading }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
          {isLoading ? <Skeleton className="mt-1 h-6 w-12" /> : <p className="text-xl font-semibold text-text">{value}</p>}
        </div>
      </CardBody>
    </Card>
  );
}

export function AdminReportsPage() {
  const [department, setDepartment] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  const filters = {
    department: department || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  };

  const { data: report, isLoading } = useAdminReports(filters);

  async function handleExport() {
    setIsExporting(true);
    try {
      const data = await adminService.exportReports(filters);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cuet-placement-report-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast({ variant: 'success', title: 'Report exported.' });
    } catch (error) {
      const message = error.response?.data?.message ?? 'Failed to export report.';
      showToast({ variant: 'danger', title: 'Export failed', description: message });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-xl font-semibold text-text">Reports</h1>
          <p className="mt-1 text-sm text-text-muted">Platform-wide placement statistics.</p>
        </div>
        <Button leftIcon={Download} onClick={handleExport} isLoading={isExporting}>
          Export JSON
        </Button>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Department"
            placeholder="e.g. Computer Science and Engineering"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
          <Input label="From Date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          <Input label="To Date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Total Students" value={report?.totalStudents ?? 0} isLoading={isLoading} />
        <StatCard icon={ClipboardCheck} label="Total Applications" value={report?.totalApplications ?? 0} isLoading={isLoading} />
        <StatCard icon={Award} label="Total Selected" value={report?.totalSelected ?? 0} isLoading={isLoading} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text">Selections by Company</h2>
        <Table>
          <TableHeader>
            <TableHead>Company</TableHead>
            <TableHead>Selected Candidates</TableHead>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoadingState columns={2} rows={3} />
            ) : !report?.byCompany || report.byCompany.length === 0 ? (
              <TableEmptyState
                colSpan={2}
                icon={Building2}
                title="No selections yet"
                description="Once candidates are marked as selected, company breakdowns will appear here."
              />
            ) : (
              report.byCompany.map((row) => (
                <TableRow key={row.companyName}>
                  <TableCell className="font-medium text-text">{row.companyName}</TableCell>
                  <TableCell className="text-text-muted">{row.selected}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
