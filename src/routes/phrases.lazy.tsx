import { createLazyFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import Phrases from "../components/phrases";
import Skeleton from "../components/skeleton";

export const Route = createLazyFileRoute('/phrases')({
  component: () => (
    <Suspense fallback={<Skeleton delay={3000} />}>
      <Phrases />
    </Suspense>
  )
})