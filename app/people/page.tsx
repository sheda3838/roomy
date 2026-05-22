import { redirect } from "next/navigation";

export default function PeoplePage() {
  redirect("/discover?tab=people");
}
