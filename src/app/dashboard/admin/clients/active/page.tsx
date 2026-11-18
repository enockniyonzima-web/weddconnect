import ClientsDirectory from "../ClientsDirectory";

export default async function AdminClientsActivePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     return <ClientsDirectory status="active" search={await searchParams} />;
}
