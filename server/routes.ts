import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleAuth";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { insertProjectSchema, insertAboutSchema, insertContactMessageSchema, insertProjectImageSchema, insertSiteSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", (req: any, res) => {
    const user = req.session?.user;
    if (user && user.isAuthenticated) {
      res.json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Object storage routes
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const aclPolicy = await objectStorageService.canAccessObjectEntity({
        objectFile,
        requestedPermission: ObjectPermission.READ,
      });
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/project-images", isAuthenticated, async (req: any, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = req.session?.user?.id || "admin";

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public",
        }
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error setting project image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Project routes - public (only published projects)
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getPublishedProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // All projects for admin (including unpublished)
  app.get("/api/admin/projects", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Project routes - protected (admin only)
  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: sessionUser.id,
      });

      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Bulk update project order - MUST be before :id route
  app.patch("/api/projects/reorder", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { projectOrders } = req.body;
      if (!Array.isArray(projectOrders)) {
        return res.status(400).json({ message: "projectOrders must be an array" });
      }

      for (const { id, sortOrder } of projectOrders) {
        await storage.updateProject(id, { sortOrder });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error reordering projects:", error);
      res.status(500).json({ message: "Failed to reorder projects" });
    }
  });

  app.patch("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // About content routes - public
  app.get("/api/about", async (req, res) => {
    try {
      const about = await storage.getAboutContent();
      res.json(about || null);
    } catch (error) {
      console.error("Error fetching about content:", error);
      res.status(500).json({ message: "Failed to fetch about content" });
    }
  });

  // About content routes - admin only
  app.put("/api/about", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertAboutSchema.parse(req.body);
      const about = await storage.upsertAboutContent(validatedData);
      res.json(about);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating about content:", error);
      res.status(500).json({ message: "Failed to update about content" });
    }
  });

  // Contact message routes - public submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ success: true, id: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Contact message routes - admin only
  app.get("/api/admin/messages", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/admin/messages/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const message = await storage.markMessageAsRead(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  app.post("/api/admin/messages/:id/reply", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { reply } = req.body;
      if (!reply || typeof reply !== 'string' || reply.trim().length === 0) {
        return res.status(400).json({ message: "Reply text is required" });
      }

      const message = await storage.replyToMessage(req.params.id, reply.trim());
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error replying to message:", error);
      res.status(500).json({ message: "Failed to send reply" });
    }
  });

  app.delete("/api/admin/messages/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const deleted = await storage.deleteContactMessage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Project images routes
  app.get("/api/projects/:id/images", async (req, res) => {
    try {
      const images = await storage.getProjectImages(req.params.id);
      res.json(images);
    } catch (error) {
      console.error("Error fetching project images:", error);
      res.status(500).json({ message: "Failed to fetch project images" });
    }
  });

  app.post("/api/projects/:id/images", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertProjectImageSchema.parse({
        ...req.body,
        projectId: req.params.id,
      });

      const image = await storage.addProjectImage(validatedData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error adding project image:", error);
      res.status(500).json({ message: "Failed to add project image" });
    }
  });

  app.delete("/api/project-images/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const deleted = await storage.deleteProjectImage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project image:", error);
      res.status(500).json({ message: "Failed to delete project image" });
    }
  });

  // Site settings routes - public
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings || null);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  // Site settings routes - admin only
  app.put("/api/site-settings", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUser = req.session?.user;
      if (!sessionUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertSiteSettingsSchema.parse(req.body);
      const settings = await storage.upsertSiteSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating site settings:", error);
      res.status(500).json({ message: "Failed to update site settings" });
    }
  });

  return httpServer;
}
