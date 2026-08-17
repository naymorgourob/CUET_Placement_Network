import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, BookOpen, MoreVertical, Pencil, Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
import { Pagination } from '@/components/shared/Pagination';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/shared/DropdownMenu';
import { ResourceFormModal } from '@/features/admin/components/ResourceFormModal';
import { useToast } from '@/hooks/useToast';
import {
  useAdminResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from '@/features/admin/adminQueries';
import { RESOURCE_CATEGORIES, getResourceCategory } from '@/utils/resourceCategories';

const CATEGORY_OPTIONS = RESOURCE_CATEGORIES.map((category) => ({ value: category.value, label: category.label }));

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

export function AdminResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [formOpen, setFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const { data, isLoading, isFetching } = useAdminResources({ page, limit: 10, search, category, status });
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();
  const { showToast } = useToast();

  const resources = data?.resources ?? [];
  const pagination = data?.pagination;

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (!('page' in updates)) {
      next.set('page', '1');
    }
    setSearchParams(next);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateParams({ search: searchInput });
  }

  function handleOpenCreate() {
    setEditingResource(null);
    setFormOpen(true);
  }

  function handleOpenEdit(resource) {
    setEditingResource(resource);
    setFormOpen(true);
  }

  function handleFormSubmit(payload) {
    if (editingResource) {
      updateResource.mutate(
        { resourceId: editingResource.resourceId, payload },
        {
          onSuccess: () => {
            showToast({ variant: 'success', title: 'Resource updated successfully.' });
            setFormOpen(false);
          },
          onError: (error) => {
            const message = error.response?.data?.message ?? 'Failed to update resource.';
            showToast({ variant: 'danger', title: 'Update failed', description: message });
          },
        }
      );
    } else {
      createResource.mutate(payload, {
        onSuccess: () => {
          showToast({ variant: 'success', title: 'Resource created successfully.' });
          setFormOpen(false);
        },
        onError: (error) => {
          const message = error.response?.data?.message ?? 'Failed to create resource.';
          showToast({ variant: 'danger', title: 'Creation failed', description: message });
        },
      });
    }
  }

  function handleToggleStatus(resource) {
    const nextStatus = resource.status === 'published' ? 'draft' : 'published';
    updateResource.mutate(
      { resourceId: resource.resourceId, payload: { status: nextStatus } },
      {
        onSuccess: () => {
          showToast({
            variant: 'success',
            title: nextStatus === 'published' ? 'Resource published.' : 'Resource unpublished.',
          });
        },
        onError: (error) => {
          const message = error.response?.data?.message ?? 'Failed to update resource status.';
          showToast({ variant: 'danger', title: 'Update failed', description: message });
        },
      }
    );
  }

  function handleToggleFeatured(resource) {
    updateResource.mutate(
      { resourceId: resource.resourceId, payload: { isFeatured: !resource.isFeatured } },
      {
        onSuccess: () => {
          showToast({
            variant: 'success',
            title: resource.isFeatured ? 'Removed from featured.' : 'Marked as featured.',
          });
        },
        onError: (error) => {
          const message = error.response?.data?.message ?? 'Failed to update resource.';
          showToast({ variant: 'danger', title: 'Update failed', description: message });
        },
      }
    );
  }

  function handleConfirmDelete() {
    if (!resourceToDelete || deleteResource.isPending) return;
    deleteResource.mutate(resourceToDelete.resourceId, {
      onSuccess: () => {
        showToast({ variant: 'success', title: 'Resource deleted.' });
        setResourceToDelete(null);
      },
      onError: (error) => {
        const message = error.response?.data?.message ?? 'Failed to delete resource.';
        showToast({ variant: 'danger', title: 'Delete failed', description: message });
        setResourceToDelete(null);
      },
    });
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
          <h1 className="text-xl font-semibold text-text">Resource Management</h1>
          <p className="mt-1 text-sm text-text-muted">Create and manage career guidance articles for students.</p>
        </div>
        <Button leftIcon={Plus} onClick={handleOpenCreate}>
          Create Resource
        </Button>
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <Input
              className="pl-9"
              placeholder="Search resources by title..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
        </form>
        <div className="w-full sm:w-56">
          <Select
            placeholder="All categories"
            value={category ?? ''}
            onValueChange={(value) => updateParams({ category: value })}
            options={CATEGORY_OPTIONS}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            placeholder="All statuses"
            value={status ?? ''}
            onValueChange={(value) => updateParams({ status: value })}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState columns={5} rows={5} />
          ) : resources.length === 0 ? (
            <TableEmptyState
              colSpan={5}
              icon={BookOpen}
              title="No resources found"
              description={data?.pagination?.total === 0 ? 'Create your first resource to get started.' : 'Try adjusting your search or filters.'}
            />
          ) : (
            resources.map((resource) => (
              <TableRow key={resource.resourceId} className={isFetching ? 'opacity-60' : ''}>
                <TableCell className="max-w-xs">
                  <p className="truncate font-medium text-text">{resource.title}</p>
                </TableCell>
                <TableCell className="text-text-muted">{getResourceCategory(resource.category).label}</TableCell>
                <TableCell>
                  <Badge variant={resource.status === 'published' ? 'success' : 'default'}>
                    {resource.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {resource.isFeatured ? (
                    <Badge variant="warning" icon={Star}>
                      Featured
                    </Badge>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label="Resource actions"
                        className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted hover:text-text"
                      >
                        <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => handleOpenEdit(resource)}>
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleToggleStatus(resource)}>
                        {resource.status === 'published' ? (
                          <>
                            <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" strokeWidth={1.75} />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleToggleFeatured(resource)}>
                        <Star className="h-4 w-4" strokeWidth={1.75} />
                        {resource.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                      </DropdownMenuItem>
                      <DropdownMenuItem destructive onSelect={() => setResourceToDelete(resource)}>
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
        />
      )}

      <ResourceFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        resource={editingResource}
        onSubmit={handleFormSubmit}
        isSubmitting={createResource.isPending || updateResource.isPending}
      />

      <ConfirmDialog
        open={Boolean(resourceToDelete)}
        onOpenChange={(open) => !open && !deleteResource.isPending && setResourceToDelete(null)}
        title="Delete this resource?"
        description="This article will be permanently removed and will no longer be visible to students. This cannot be undone."
        confirmLabel="Delete Resource"
        variant="destructive"
        isLoading={deleteResource.isPending}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
