import { Suspense } from "react";
import UserLoginPage from "./UserLoginPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <UserLoginPage />
    </Suspense>
  );
}
