import { redirect } from "next/navigation";

type Props = { params: Promise<{ queueId: string }> };

/**
 * Backend QR URLs are `{QR_CODE_BASE_URL}/{queue_id}/join`
 * (see backend/app/utils/qr_code.py).
 */
export default async function LegacyJoinRedirect({ params }: Props) {
  const { queueId } = await params;
  redirect(`/join/${queueId}`);
}
