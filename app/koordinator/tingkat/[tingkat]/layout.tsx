export async function generateMetadata({
  params,
}: {
  params: { tingkat: string };
}) {
  const tingkat = params.tingkat;

  return {
    title: tingkat,
  };
}
function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default UserLayout;
