import AuthPage from "@/components/auth-page/auth-page";
import { authSession } from "@/lib/auth-utils";
import MainPage from "@/components/mapUI/main-map";

export default async function Home() {

  const session = await authSession();

  return (
    <div className="">
      {
        session ? (
          <div>
            <MainPage/>
          </div>
  
        ) : <AuthPage />
      }
    {/* <MainPage/> */}
      {/* <AuthPage /> */}
    </div>
  );
}
