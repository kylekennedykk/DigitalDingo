export const setAdminClaim = async (uid: string) => {
  const auth = getAuth();
  await auth.setCustomUserClaims(uid, { admin: true });
  return true;
}; 