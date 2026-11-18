import ClientsDirectory from "../ClientsDirectory";

export default async function AdminClientsNoSubscriptionsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
     return <ClientsDirectory status="none" search={await searchParams} />;
}
