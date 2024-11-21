import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div>
      <div>ErrorPage</div>
      <p>error: {error.message || error.status}</p>
    </div>
  );
};

export default ErrorPage;
