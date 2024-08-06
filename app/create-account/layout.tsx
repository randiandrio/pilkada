export const metadata = {
  title: "Data Aplikasi",
};

function UserLayout({ children }: { children: React.ReactNode }) {
  return <div className="px-10 py-10">{children}</div>;
}

export default UserLayout;
