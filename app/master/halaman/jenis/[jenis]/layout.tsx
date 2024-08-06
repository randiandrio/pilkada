import { ucwords } from "@/app/helper";

export async function generateMetadata({
  params,
}: {
  params: { jenis: string };
}) {
  const jenis = params.jenis;

  return {
    title: `Halaman ${ucwords(jenis)}`,
  };
}
function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default UserLayout;
