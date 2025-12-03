import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";
const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const user = useLoaderData();
  const navigate = useNavigate();
  const hanldeLogout = () => {
    navigate("/sign-in");
  };

  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img
          src="/assets/images/Visit-kembata-logo.jpg"
          alt="logo"
          className="size-[40px]"
        />
        <h1>VISIT KEMBATA</h1>
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-5 group-hover:invert ${isActive ? "brightness-0 invert" : "text-dark-200"}`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "David"}
            referrerPolicy="no-referrer"
          />
          <article>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </article>
          <button className="cursor-pointer" onClick={hanldeLogout}>
            <img
              src="/assets/icons/logout.svg"
              alt="log out"
              className="size-6"
            />
          </button>
        </footer>
        f
      </div>
    </section>
  );
};
export default NavItems;
