import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getRoomMatchDetails } from "@/server/actions/getRoomMatchDetails";
import MatchExperienceClient from "@/components/match/MatchExperienceClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  return {
    title: `Compatibility Match - ${p.slug} | Roomy`,
    description: "Check your compatibility score with this room.",
  };
}

export default async function MatchExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const data = await getRoomMatchDetails(p.slug);
  
  if (data.error === "You must be logged in to view compatibility details.") {
    redirect("/login");
  }

  if (data.error || !data.match || !data.room) {
    notFound();
  }

  return <MatchExperienceClient data={data} />;
}
