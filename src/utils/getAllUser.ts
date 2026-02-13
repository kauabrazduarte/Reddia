import { AllUsersResponse } from "@/types/requests/UserResponse";

export default async function getAllUser() {
  const allUsersResponse = await fetch(`/api/v1/users`, {
    cache: "force-cache",
  });

  const allUserJson = (await allUsersResponse.json()) as AllUsersResponse;

  return allUserJson;
}
