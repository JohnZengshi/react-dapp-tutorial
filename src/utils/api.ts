/*
 * @LastEditors: John
 * @Date: 2024-01-10 10:15:30
 * @LastEditTime: 2024-03-12 13:55:15
 * @Author: John
 */
import { TYPE_ADDRESS } from "@/types";
import { fetchUrl, getChainCode, localStorageKey } from ".";
import { ChainType } from "@/store/reducer";

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
  status: 1 | 2 | 3; // 1：认购中；2：已完成；3：待认购
  buyCoinName: string; // 认购币种
  nftOne: string; // 1级NFT配件奖励比例
  nftTwo: string; // 2级NFT配件奖励比例
  rbitOne: string; // 1级rbit奖励比例
  rebateRatio: string; // 推荐NFT并获得 5% 的返利
  rebateTwo: string; // 2级rbit奖励比例
  title: string;
};
export async function API_GET_NODE_LIST() {
  let res = await fetchUrl<NodeInfo[]>("/api/node/getNodeSetting", {
    method: "GET",
  });
  return res.data;
}

export async function API_CHECT_EXIT(address: TYPE_ADDRESS) {
  let res = await fetchUrl<{ exist: boolean }>(
    `/api/account/exist?account=${address}&chainType=1`,
    {
      method: "GET",
    }
  );
  return res?.data.exist;
}

export type SIGNUP_CHAIN_TYPE = 1 | 2 | 3 | 4 | 5 | 6; // 1=Bitcoin 2=Ethereum 3=Polygon 4=BNB Chain 5=Arbitrum One
export async function API_SIGNUP(
  address: TYPE_ADDRESS,
  shareCode: string,
  publicKey: string
  // chainType: ChainType
) {
  let res = await fetchUrl<
    any,
    {
      account: TYPE_ADDRESS;
      shareCode: string;
      publicKey: string;
      chainType: SIGNUP_CHAIN_TYPE;
    }
  >(
    `/api/account/signUp`,
    { method: "POST" },
    {
      account: address,
      shareCode,
      publicKey,
      // chainType: getChainCode(chainType),
      chainType: 1,
    }
  );
  return res?.data;
}

export async function API_LOGIN(
  address: string,
  sign: string,
  publicKey: string
  // chainType: ChainType
) {
  let loginInfo = await fetchUrl<
    { token: string },
    {
      account: string;
      password: string;
      publicKey: string;
      chainType: SIGNUP_CHAIN_TYPE;
    }
  >(
    "/api/account/signIn",
    {
      method: "POST",
    },
    {
      account: address,
      password: sign,
      publicKey,
      // chainType: getChainCode(chainType),
      chainType: 1,
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

export async function API_GET_USER_SIGNATURE(address: string) {
  let res = await fetchUrl<{ encryptedString: "" }>(
    `/api/account/getUserSignature?account=${address}`,
    {
      method: "GET",
    }
  );

  return res?.data;
}

export async function API_BIND_OR_NOT() {
  let res = await fetchUrl<{ result: boolean }>(`/api/account/bindOrNot`, {
    method: "GET",
  });

  return res?.data.result;
}

export async function API_BINDING_RELATIONSHIP(shareCode: string) {
  let res = await fetchUrl<{ result: boolean }, { shareCode: string }>(
    `/api/account/bindingRelationship`,
    {
      method: "POST",
    },
    {
      shareCode,
    }
  );

  return res;
}

export type BOX_MY_POINT = {
  iveFinished: string;
  myIntegral: string;
  recommend: string;
  recommendationPoints: string;
};
export async function API_GET_MY_POINT() {
  let res = await fetchUrl<BOX_MY_POINT>(`/api/task/myBonusPoints`, {
    method: "GET",
  });
  return res?.data;
}

export type API_RECOMMEND_LIST_PARAMS = {
  page: number;
  size: number;
};

export type API_RECOMMEND_LIST_ITEM = {
  address: string;
  number: string;
  type: 1 | 2 | 3 | 4 | 5;
};

export async function API_RECOMMEND_LIST(params: API_RECOMMEND_LIST_PARAMS) {
  const { page, size } = params;
  let res = await fetchUrl<Array<API_RECOMMEND_LIST_ITEM>>(
    `/api/task/recommendedCompletionList?page=${page}&size=${size}`,
    {
      method: "GET",
    }
  );
  return res?.data;
}

export async function API_GET_ACCESSORIES_NUM() {
  let res = await fetchUrl<{ result: number }>(`/api/user/minerFittings`, {
    method: "GET",
  });
  return res?.data;
}

export async function API_GET_ORDER_STATE_BY_HASH(hash: string) {
  let res = await fetchUrl<{ nftIds: null | "0" | string }>(
    `/api/node/getOrderStateByHash?hash=${hash}`,
    {
      method: "GET",
    }
  );
  return res?.data;
}

export type REFERRAL_REWARD = {
  bitAmount: string;
  invitationCode: string;
  oneBrit: string;
  oneNft: string;
  oneNftAmount: string;
  rebate: string;
  twoBrit: string;
  twoNft: string;
  twoNftAmount: string;
  usdtAmount: string;
};
export async function API_REFERRAL_REWARD() {
  let res = await fetchUrl<REFERRAL_REWARD>(`/api/user/referralReward`, {
    method: "GET",
  });
  return res?.data;
}

export type TEAM_LIST_ITEM = { address: string; number: string };
export async function API_TEAM_LIST(grade: 1 | 2) {
  let res = await fetchUrl<TEAM_LIST_ITEM[]>(
    `/api/user/teamList?grade=${grade}`,
    {
      method: "GET",
    }
  );
  return res?.data;
}

export type W_ORD_NODE_PRO_ITEM = {
  buyAmount: string;
  id: number;
  illustrate: string;
  nodeGrade: number;
  nodeName: string;
  status: number;
};
export async function API_GET_W_ORD_NODE_PRO() {
  let res = await fetchUrl<W_ORD_NODE_PRO_ITEM[]>(`/api/node/getWOrdNodePro`, {
    method: "GET",
  });
  return res?.data;
}

export async function API_CONTRACT_ADDRESS() {
  let res = await fetchUrl<{ address: TYPE_ADDRESS }>(
    `/api/node/contractAddress`,
    {
      method: "GET",
    }
  );
  return res?.data.address;
}
