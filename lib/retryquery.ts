import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace";
export async function retryQuery<T>(
  query: () => Promise<T>,
  retries: number = 3,
): Promise<T> {
  let attempt = 0;
  const maxAttempts = retries + 1;
  while (attempt < maxAttempts) {
    try {
      const result = await query();
      return result;
    } catch (error) {
      attempt++;

      const isPrismaRetryable =
        error instanceof PrismaClientKnownRequestError &&
        ["P1001", "P1008", "P1017", "P2034"].includes(error.code);

      const isNetworkError =
        error instanceof Error &&
        "code" in error &&
        ["ENETUNREACH", "ETIMEDOUT"].includes((error as { code: string }).code);

      if (attempt >= maxAttempts || !(isPrismaRetryable || isNetworkError))
        throw error;
      const errorCode =
        error instanceof PrismaClientKnownRequestError
          ? error.code
          : error instanceof Error && "code" in error
            ? (error as { code: string }).code
            : "UNKNOWN";
      console.warn(
        `Attempt ${attempt} failed with error code: ${errorCode}. Retrying...`,
      );
      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }
  throw new Error("Retry failed");
}
