import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Squad Builder!</h1>

      <button
        type="button"
        onClick={() => {
          const key = Number(new Date()).toString(16);
          navigate(`/squad/${key}`);
        }}
      >
        Get Started
      </button>
    </div>
  );
}
