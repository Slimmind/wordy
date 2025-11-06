import { createLazyFileRoute } from "@tanstack/react-router";
import GameCenter from "../components/game-center";

export const Route = createLazyFileRoute('/game-center')({
  component: GameCenter
})