/*
 * @LastEditors: John
 * @Date: 2024-01-10 10:15:30
 * @LastEditTime: 2024-01-15 09:45:54
 * @Author: John
 */
import store from "@/store/store";
import { fetchUrl, localStorageKey } from ".";

export type NodeInfo = {
  nodeTotal: number;
  purchasedCount: number;
  startPrice: number;
  increasePrice: number;
  increaseCount: number;
  nodePrice: number;
  id: number;
  nodeName: string;
  contribution: number;
  nftNumber: number;
  illustrate: string;
};
export async function API_GET_NODE_LIST() {
  let res = await fetchUrl<NodeInfo[]>("/api/node/getNodeSetting", {
    method: "GET",
  });
  return res.data;
}

export async function API_CHECT_EXIT(address: string) {
  let res = await fetchUrl<{ exist: boolean }>(
    `/api/account/exist?account=${address}`,
    {
      method: "GET",
    }
  );
  return res?.data.exist;
}

export async function API_SIGNUP(
  address: string,
  shareCode: string,
  publicKey: string
) {
  let res = await fetchUrl<
    any,
    { account: string; shareCode: string; publicKey: string }
  >(
    `/api/account/signUp`,
    { method: "POST" },
    {
      account: address,
      shareCode,
      publicKey,
    }
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

export type CONTRIBUTION = {
  contribution: string;
  nftNumer: string;
  userNumber: number;
};
export async function API_GET_CONTRIBUTION() {
  let res = await fetchUrl<CONTRIBUTION>("/api/invite/getNodeSetting", {
    method: "GET",
  });
  return res?.data;
}

export type INVITE_VO_LIST_ITEM = {
  address: string;
  status: number;
  nodeName: string;
};
export async function API_GET_INVITE_VO_LIST() {
  let res = await fetchUrl<INVITE_VO_LIST_ITEM[]>(
    "/api/invite/findInviteVoList",
    { method: "GET" }
  );

  return res?.data;
}

export async function API_PAY_NODE_SMS(
  orderNumber: number,
  hash: string,
  status: 1 | 2
) {
  let res = await fetchUrl<{ type: number }>(
    `/api/node/pay_node_sms?orderNumber=${orderNumber}&hash=${hash}&status=${status}`,
    { method: "GET" }
  );

  return res?.data;
}

export type BOX_USER_PURCHASED = {
  buyAmount: number;
  illustrate: string;
  nodeName: string;
  status: 1 | 2 | 3;
};
export async function API_QUERY_BOX_USER_HAS_PURCHASED() {
  let res = await fetchUrl<BOX_USER_PURCHASED>(`/api/node/getWOrdNode`, {
    method: "GET",
  });

  return res?.data;
}
