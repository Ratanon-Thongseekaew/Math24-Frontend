import { type RouteConfig, index,route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login","routes/auth/login.tsx"),
    route("register","routes/auth/register.tsx"),
    route("home","routes/user/userHome.tsx"),
    route("game","routes/games/game.tsx"),
    route("history","routes/user/userHistory.tsx")
] satisfies RouteConfig;