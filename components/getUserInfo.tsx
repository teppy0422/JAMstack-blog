"use server";

export const getUserInfo = async (
  post_userID: any,
  userInfo: any[],
  fetchAndSetUserInfo: (id: any) => Promise<any>
) => {
  let user = userInfo.find((user) => user.id === post_userID); // ユーザー情報を取得
  if (!user) {
    user = await fetchAndSetUserInfo(post_userID); // ユーザー情報を取得して状態に保存
  }
  return user?.displayName || "ゆーざー1"; // displayNameがundefinedの場合のデフォルト値
};
