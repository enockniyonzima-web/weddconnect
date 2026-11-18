import ClientsDirectory from "../ClientsDirectory";

export default async function AdminClientsPendingPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     return <ClientsDirectory status="pending" search={await searchParams} />;
}
