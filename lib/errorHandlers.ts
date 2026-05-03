import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from "@/generated/prisma/internal/prismaNamespace";

export function handlePrismaError(error: unknown): string {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        const target = (error.meta?.target as string[])?.join(", ") || "field";
        return `A record with this ${target} already exists.`;
      case "P2003":
        return "Related record not found (foreign key constraint failed).";
      case "P2025":
        return "The requested record was not found.";
      case "P1001": 
      case "P1002":
        return "Could not reach the database server. Please try again.";
      case "P1017":
        return "The database connection was closed. Retrying might help.";
      default:
        return `Database Error (${error.code}): Something went wrong.`;
    }
  }

  if (error instanceof PrismaClientInitializationError) {
    if (error.message.includes("too many connections")) {
      return "The database is currently overloaded with too many connections.";
    }
    return "Failed to initialize database connection.";
  }

  if (error instanceof PrismaClientValidationError) {
    return "The data provided is not compatible with the database schema.";
  }

  return "An unexpected database error occurred.";
}
