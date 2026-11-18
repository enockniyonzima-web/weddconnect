import ClientsDirectory from "../ClientsDirectory";

export default async function AdminClientsExpiredPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     return <ClientsDirectory status="expired" search={await searchParams} />;
}
