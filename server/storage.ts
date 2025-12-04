import {
  users,
  projects,
  aboutContent,
  contactMessages,
  projectImages,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type About,
  type InsertAbout,
  type ContactMessage,
  type InsertContactMessage,
  type ProjectImage,
  type InsertProjectImage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getPublishedProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // About content operations
  getAboutContent(): Promise<About | undefined>;
  upsertAboutContent(about: InsertAbout): Promise<About>;
  
  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: string): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: string): Promise<boolean>;
  
  // Project images operations
  getProjectImages(projectId: string): Promise<ProjectImage[]>;
  addProjectImage(image: InsertProjectImage): Promise<ProjectImage>;
  updateProjectImageOrder(id: string, sortOrder: number): Promise<ProjectImage | undefined>;
  deleteProjectImage(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if this is the first user - make them admin
    const existingUsers = await db.select().from(users).limit(1);
    const isFirstUser = existingUsers.length === 0;

    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        isAdmin: isFirstUser ? true : userData.isAdmin,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .orderBy(desc(projects.sortOrder), desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getPublishedProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(desc(projects.sortOrder), desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(
    id: string,
    projectData: Partial<InsertProject>
  ): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // About content operations
  async getAboutContent(): Promise<About | undefined> {
    const [about] = await db.select().from(aboutContent).limit(1);
    return about;
  }

  async upsertAboutContent(about: InsertAbout): Promise<About> {
    const existing = await this.getAboutContent();
    if (existing) {
      const [updated] = await db
        .update(aboutContent)
        .set({ ...about, updatedAt: new Date() })
        .where(eq(aboutContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(aboutContent).values(about).returning();
      return created;
    }
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async markMessageAsRead(id: string): Promise<ContactMessage | undefined> {
    const [updated] = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return result.length > 0;
  }

  // Project images operations
  async getProjectImages(projectId: string): Promise<ProjectImage[]> {
    return await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, projectId))
      .orderBy(asc(projectImages.sortOrder));
  }

  async addProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
    const [created] = await db.insert(projectImages).values(image).returning();
    return created;
  }

  async updateProjectImageOrder(id: string, sortOrder: number): Promise<ProjectImage | undefined> {
    const [updated] = await db
      .update(projectImages)
      .set({ sortOrder })
      .where(eq(projectImages.id, id))
      .returning();
    return updated;
  }

  async deleteProjectImage(id: string): Promise<boolean> {
    const result = await db.delete(projectImages).where(eq(projectImages.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
