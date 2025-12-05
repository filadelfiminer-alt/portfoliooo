import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const isProduction = process.env.NODE_ENV === "production";
  
  let sessionStore;
  
  if (process.env.DATABASE_URL) {
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  } else {
    const MemoryStore = createMemoryStore(session);
    sessionStore = new MemoryStore({
      checkPeriod: sessionTtl,
    });
  }
  
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    const adminUsername = process.env.ADMIN_USERNAME || "Filadelfi";
    const adminPassword = process.env.ADMIN_PASSWORD || "Filadelfipasswordexecute";
    
    if (username === adminUsername && password === adminPassword) {
      (req.session as any).user = {
        id: "admin",
        username: adminUsername,
        isAdmin: true,
        isAuthenticated: true
      };
      res.json({ success: true, user: { username: adminUsername, isAdmin: true } });
    } else {
      res.status(401).json({ success: false, message: "Неверный логин или пароль" });
    }
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Ошибка выхода" });
      } else {
        res.redirect("/");
      }
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const user = (req.session as any)?.user;
  
  if (user && user.isAuthenticated) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};
