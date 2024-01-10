/*
 * @LastEditors: John
 * @Date: 2024-01-10 10:15:30
 * @LastEditTime: 2024-01-10 10:19:02
 * @Author: John
 */
import { fetchUrl, localStorageKey } from ".";

export function Login(sign: string) {
  fetchUrl("/api/account/signIn", {
    method: "POST",
    body: JSON.stringify({
      account: localStorage.getItem(localStorageKey.okx_address),
      password: sign,
    }),
  }).then((res) => {
    console.log(res);
  });
}
