import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/encontre-um-revendedor")({
  beforeLoad: () => {
    throw redirect({ to: "/revendedores", replace: true });
  },
});
