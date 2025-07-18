import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>My TanStack Table</header>
      <nav>
        <Link to="/">HOME</Link> |{" "}
        <Link to="/tanstackTable" >Tanstack Table</Link>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => <div>ERROR 404!!!! Page not found</div>,
});
