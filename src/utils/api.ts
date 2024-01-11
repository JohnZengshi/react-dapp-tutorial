/*
 * @LastEditors: John
 * @Date: 2024-01-10 10:15:30
 * @LastEditTime: 2024-01-11 23:04:31
 * @Author: John
 */
import { fetchUrl, localStorageKey } from ".";

export function Login(sign: string) {}

export async function API_CHECT_EXIT(address: string) {
  let res = await fetchUrl<{ exist: boolean }>(
    `/api/account/exist?account=${address}`,
    {
      method: "GET",
    }
  );
  return res?.data.exist;
}

export async function API_SIGNUP(address: string) {
  let res = await fetchUrl<any, { account: string; shareCode: string }>(
    `/api/account/signUp`,
    { method: "POST" },
    { account: address, shareCode: "NODE123" }
  );
  return res?.data;
}

export async function API_LOGIN(
  address: string,
  sign: string,
  publicKey: string
) {
  let loginInfo = await fetchUrl<
    { token: string },
    { account: string; password: string; publicKey: string }
  >(
    "/api/account/signIn",
    {
      method: "POST",
    },
    {
      account: address,
      password: sign,
      publicKey,
    }
  );

  return loginInfo?.data;
}

export async function API_CHECK_INVITE_CODE() {
  let invitation = await fetchUrl<{
    invitationCode: string;
  }>("/api/invite/invitationCode", { method: "GET" });
  return invitation?.data.invitationCode;
}
