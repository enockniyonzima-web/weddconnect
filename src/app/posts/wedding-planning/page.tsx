"use client";
import { useRouter } from "next/navigation";
import CategoryPostContainer from "../[components]/CategoryPostContainer";

export default function VenuesPage() {
     const router = useRouter();
     const handleBack = () => router.push("/posts");
     return (
          <CategoryPostContainer categoryId={17} onBack={handleBack}  />
     )
}