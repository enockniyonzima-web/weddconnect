import ClientsDirectory from "../ClientsDirectory";

export default async function AdminClientsAllPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     return <ClientsDirectory status="all" search={await searchParams} />;
}
