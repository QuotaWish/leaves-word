/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.LoginUserVO, auth?: API.AuthUserVO } | undefined) {
  const { currentUser, auth } = initialState ?? {};
  return {
    canAuth: auth,
    canUser: currentUser,
    canAdmin: currentUser && currentUser.userRole === 'admin',
  };
}
