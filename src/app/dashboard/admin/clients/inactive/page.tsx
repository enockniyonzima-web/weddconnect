import ClientsDirectory from "../ClientsDirectory";

export default async function AdminClientsInactivePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     return <ClientsDirectory status="inactive" search={await searchParams} />;
}
