import { createBrowserRouter } from "react-router-dom";
import _Root from "../_Root";
import Landing from "../routes";
import About from "../routes/About";
import Register from "../routes/auth/AuthPage";
import NotLoggedIn from "../routes/NotLoggedIn";
import LayoutPage from "../routes/home/_LayoutPage";
import Dashboard from "../routes/home/Dashboard";
import Onboarding from "../routes/home/Onboarding";
import AddCategory from "../routes/home/categories/AddCategory";
import Category from "../routes/home/categories/Category";
import Expense from "../routes/home/expense/Expense";
import AddExpense from "../routes/home/expense/AddExpense";
import Profile from "../routes/home/Profile";
import Summaries from "../routes/home/summary/Summaries";
import Summary from "../routes/home/summary/Summary";
import Saved from "../routes/home/Saved";
import EditCategory from "../routes/home/categories/EditCategory";
import EditExpense from "../routes/home/expense/EditExpense";
import { getCategory, getExpense } from "./loaders";
import ErrorPage from "../ErrorPage";
import { queryClient } from "../_Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <_Root />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "auth",
        element: <Register />,
      },
      {
        path: "not-logged-in",
        element: <NotLoggedIn />,
      },
      {
        path: "onboarding",
        element: <Onboarding />,
      },
      {
        element: <LayoutPage />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "category",
            children: [
              {
                path: "add",
                element: <AddCategory />,
              },
              {
                path: ":category/edit",
                element: <EditCategory />,
                loader: getCategory(queryClient),
              },
              {
                path: ":category",
                element: <Category />,
              },
              {
                path: ":category/expense",
                children: [
                  {
                    path: "add",
                    element: <AddExpense />,
                  },
                  {
                    path: ":expense",
                    element: <Expense />,
                  },
                  {
                    path: ":expense/edit",
                    element: <EditExpense />,
                    loader: getExpense(queryClient)
                  },
                ],
              },
            ],
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "weeklysummaries",
            element: <Summaries />,
            children: [
              {
                path: ":weeklysummary",
                element: <Summary />,
              },
            ],
          },
          {
            path: "saved",
            element: <Saved />,
          },
          {
            path: "/about",
            element: <About />,
          },
        ],
      },
    ],
  },
]);
export default router;
