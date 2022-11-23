import { persistMiddleware } from "./persist-middleware";

export const beforeStateChangeMiddlewares = [];

export const afterStateChangeMiddlewares = [persistMiddleware];
