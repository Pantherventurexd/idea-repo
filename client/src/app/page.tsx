import LandingPage from "./landing-page/page";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Home() {
  return (
    <div>
      <ProtectedRoute>
        <LandingPage />
      </ProtectedRoute>
    </div>
  );
}
