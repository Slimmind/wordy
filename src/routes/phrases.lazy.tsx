import { createLazyFileRoute } from "@tanstack/react-router";
import Phrases from "../components/phrases";

export const Route = createLazyFileRoute('/phrases')({
  component: Phrases
})