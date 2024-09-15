import { useState, lazy } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../contexts/auth.context";

const InternalWindow = lazy(() => import("../internal-window"));
const Block = lazy(() => import("../block"));
const Alert = lazy(() => import("../alert"));

export const Profile = () => {
  const [error, setError] = useState<string>("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogOut() {
    setError("");
    try {
      await logout();
      navigate({ to: "/" });
    } catch {
      setError("Failed to log out");
    }
  }

  if (error) {
    return (
      <Alert shown={!!error} type="error" title="Error!">
        {error}
      </Alert>
    );
  }
  return (
    <InternalWindow title="Profile">
      <Block>
        <strong>Email: </strong>
        {currentUser?.email}
      </Block>
      <Link to="/update-profile" className="btn btn--wide">
        Update Profile
      </Link>
      <p className="centered underlined" onClick={handleLogOut}>
        Log Out
      </p>
    </InternalWindow>
  );
};
