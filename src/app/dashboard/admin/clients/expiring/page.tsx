import ClientsDirectory from "../ClientsDirectory";

export default async function AdminClientsExpiringPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     return <ClientsDirectory status="expiring" search={await searchParams} />;
}
