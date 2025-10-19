export type InboundMessageDTO = {
  gameId: string;
  objectId: string;
  operationId: string;
  args: Record<string, unknown>;
};

export function validateInboundMessageDTO(input: unknown): input is InboundMessageDTO {
  if (typeof input !== "object" || input === null) return false;
  const obj = input as Record<string, unknown>;
  if (typeof obj.gameId !== "string") return false;
  if (typeof obj.objectId !== "string") return false;
  if (typeof obj.operationId !== "string") return false;
  if (typeof obj.args !== "object" || obj.args === null) return false;
  return true;
}

