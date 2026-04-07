export async function register() {
  console.log(
    "***********************************************************************",
  );
  console.log("data bse usr : ", process.env.DATABASE_URL);
  console.log("data bse GOOGLE_CLIENT_ID : ", process.env.GOOGLE_CLIENT_ID);
  console.log("data bse GOOGLE_CLIENT_SECRET : ", process.env.GOOGLE_CLIENT_SECRET);
  console.log("data bse NEXTAUTH_URL : ", process.env.NEXTAUTH_URL);
  console.log("data bse NEXTAUTH_SECRET : ", process.env.NEXTAUTH_SECRET);
  console.log(
    "***********************************************************************",
  );
}
