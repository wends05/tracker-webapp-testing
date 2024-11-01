import { createBrowserRouter } from "react-router-dom";
import Landing from "../routes";
import About from "../routes/About";
import Login from "../routes/auth/Login";
import Register from "../routes/auth/Register";
import NotLoggedIn from "../routes/NotLoggedIn";
import LayoutPage from "../routes/home/LayoutPage";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/not-logged-in",
    element: <NotLoggedIn />,
  },
  {
    path: "onboarding",
    element: <Onboarding />,
  },
  {
    element: <LayoutPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "categories",
        children: [
          {
            path: "add",
            element: <AddCategory />,
          },
          {
            path: ":category",
            element: <Category />,
            children: [
              {
                path: "expense",
                children: [
                  {
                    path: ":expense",
                    element: <Expense />,
                    children: [
                      {
                        path: "/edit",
                        element: <EditCategory />
                      }
                    ]
                  },
                  {
                    path: "add",
                    element: <AddExpense />,
                  },
                ],
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
    ],
  },
]);
export default router;
