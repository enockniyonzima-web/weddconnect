import Link from "next/link";
import { Store, BadgeCheck, Eye, FilePlus2, PhoneOff, ClipboardCheck } from "lucide-react";
import { fetchVendorCounts, fetchVendorDirectory, fetchCategoryOptions, VENDOR_SETUP_FILTERS, VENDOR_SORTS } from "@/lib/admin/vendors-report";
import { formatCount } from "@/lib/admin/format";
import { PageHeader, StatCard, EmptyState } from "@/components/admin/insights/StatCard";
import { SearchBox, SelectFilter, ChipFilter, ClearFilters, PageSizeSelect } from "@/components/admin/insights/Filters";
import { Pagination, parsePaging } from "@/components/admin/insights/Pagination";
import { VendorFormBtn } from "@/components/forms/VendorForm";
import { AdminContactTypeContainer } from "@/components/containers/admin/AdminContactTypesContainer";
import { VendorsList } from "./VendorsContainers";

const BASE = "/dashboard/admin/posts/vendors";
const FILTER_KEYS = ["q", "status", "setup", "category", "sort"];

export default async function VendorsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     const search = await searchParams;
     const { page, size } = parsePaging(search, 12);
     const [counts, { vendors, total }, categories] = await Promise.all([
          fetchVendorCounts(),
          fetchVendorDirectory(search, page, size),
          fetchCategoryOptions(),
     ]);
     const totalPages = Math.max(1, Math.ceil(total / size));
     const filtered = FILTER_KEYS.some((k) => search[k]);

     return (
          <div className="w-full space-y-6 pb-10">
               <PageHeader icon={<Store size={24} />} title="Vendors" description="Businesses that offer wedding services on WeddConnect. Add a vendor, keep their contact details complete, and see how their posts perform.">
                    <VendorFormBtn showBtnName showBtnIcon />
               </PageHeader>

               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard title="All vendors" value={formatCount(counts.total)} icon={<Store size={20} />} tone="blue" href={BASE} linkLabel="Show all" info="Every vendor account on the platform." />
                    <StatCard title="Active vendors" value={formatCount(counts.active)} icon={<BadgeCheck size={20} />} tone="green" delay={0.05} href={`${BASE}?status=active`} sub={`${formatCount(counts.inactive)} switched off`} info="Active vendors can be picked when creating a new post. Switching a vendor off removes them from that list; their existing posts stay as they are." />
                    <StatCard title="Visible to the public" value={formatCount(counts.withLive)} icon={<Eye size={20} />} tone="teal" delay={0.1} href={`${BASE}?setup=live`} sub="vendors with live posts" info="Vendors with at least one published post. Published posts are the ones visitors can see on the site." />
                    <StatCard title="Posts to approve" value={formatCount(counts.pendingPosts)} icon={<ClipboardCheck size={20} />} tone="amber" delay={0.15} href={`${BASE}?setup=pending`} linkLabel="See vendors" info="Posts submitted for these vendors that are still waiting for approval, so they are not visible yet." />
                    <StatCard title="No posts yet" value={formatCount(counts.noPosts)} icon={<FilePlus2 size={20} />} tone="purple" delay={0.2} href={`${BASE}?setup=no-posts`} linkLabel="Needs a post" info="Vendors with no posts at all, so visitors cannot find them yet. Create a post for them in the Posts tab." />
                    <StatCard title="Missing contacts" value={formatCount(counts.noContacts)} icon={<PhoneOff size={20} />} tone="red" delay={0.25} href={`${BASE}?setup=no-contacts`} linkLabel="Complete details" info="Vendors without any phone, email or other contact. Clients cannot reach them. Click Edit on a vendor to add contacts." />
               </div>

               <div className="relative z-20 flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                         <SearchBox placeholder="Search by vendor name, email, phone or post title" />
                         <SelectFilter param="setup" label="Show" allLabel="Everyone" options={VENDOR_SETUP_FILTERS.map((f) => ({ value: f.value, label: f.label }))} />
                         <SelectFilter param="category" label="Category" options={categories.map((c) => ({ value: String(c.id), label: c.name }))} />
                         <SelectFilter param="sort" label="Sort" allLabel="Newest first" options={VENDOR_SORTS.map((s) => ({ value: s.value, label: s.label }))} />
                         <ClearFilters keys={FILTER_KEYS} />
                    </div>
                    <ChipFilter param="status" options={[{ value: "active", label: "Active", count: counts.active }, { value: "inactive", label: "Switched off", count: counts.inactive }]} />
               </div>

               {vendors.length === 0 ? (
                    <EmptyState
                         icon={<Store size={20} />}
                         title={filtered ? "No vendors match your filters" : "No vendors yet"}
                         text={filtered ? "Try another search word or clear the filters." : "Add your first vendor to start listing wedding services."}
                         action={filtered ? <Link href={BASE} className="mt-2 text-sm text-blue-300 hover:text-blue-200">Clear filters</Link> : <div className="mt-2"><VendorFormBtn showBtnName showBtnIcon /></div>}
                    />
               ) : (
                    <VendorsList vendors={vendors} />
               )}

               <div className="flex flex-col gap-3">
                    <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} total={total} pageSize={size} search={search} itemLabel="vendors" />
                    {total > 12 && <div className="flex justify-center sm:justify-end"><PageSizeSelect sizes={[12, 24, 48, 100]} fallback={12} /></div>}
               </div>

               <AdminContactTypeContainer />
          </div>
     );
}
