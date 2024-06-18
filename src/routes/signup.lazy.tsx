import { createLazyFileRoute } from "@tanstack/react-router";
import SignUpForm from "../components/signup-form";

export const Route = createLazyFileRoute('/signup')({
  component: SignUpForm
})