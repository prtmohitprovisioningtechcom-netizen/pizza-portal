import { OrderTrackingClient } from "@/app/order/[orderNumber]/OrderTrackingClient";

type Params = {
  params: Promise<{ slug: string; orderNumber: string }>;
};

export default async function TenantOrderTrackingPage({ params }: Params) {
  const { orderNumber } = await params;
  return <OrderTrackingClient orderNumber={orderNumber} />;
}
