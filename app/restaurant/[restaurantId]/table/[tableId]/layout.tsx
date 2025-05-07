import ClientCartProvider from "@/components/layout/ClientCartProvider";

export default function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantId: string; tableId: string };
}) {
  return (
    <ClientCartProvider restaurantId={params.restaurantId} tableId={params.tableId}>
      {children}
    </ClientCartProvider>
  );
}