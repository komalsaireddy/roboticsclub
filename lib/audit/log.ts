import type { SupabaseClient } from "@supabase/supabase-js";

interface CreateAuditLogParams {
  supabase: SupabaseClient;
  userId: string;

  action: string;
  entityType: string;
  entityId?: string | null;

  description: string;

  metadata?: Record<
    string,
    unknown
  >;
}

export async function createAuditLog({
  supabase,
  userId,
  action,
  entityType,
  entityId,
  description,
  metadata,
}: CreateAuditLogParams): Promise<void> {
  const {
    error,
  } = await supabase
    .from("system_logs")
    .insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id:
        entityId ?? null,
      description,
      metadata:
        metadata ?? null,
    });

  if (error) {
    /*
     * Audit logging should never silently
     * break the actual admin operation.
     *
     * The database change has already succeeded,
     * so log the audit failure on the server.
     */
    console.error(
      "Failed to create system audit log:",
      error
    );
  }
}
