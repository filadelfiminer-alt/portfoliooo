import {
  users,
  projects,
  aboutContent,
  contactMessages,
  projectImages,
  siteSettings,
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
  type SiteSettings,
  type InsertSiteSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getPublishedProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  getAboutContent(): Promise<About | undefined>;
  upsertAboutContent(about: InsertAbout): Promise<About>;
  
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: string): Promise<ContactMessage | undefined>;
  replyToMessage(id: string, reply: string): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: string): Promise<boolean>;
  
  getProjectImages(projectId: string): Promise<ProjectImage[]>;
  addProjectImage(image: InsertProjectImage): Promise<ProjectImage>;
  updateProjectImageOrder(id: string, sortOrder: number): Promise<ProjectImage | undefined>;
  deleteProjectImage(id: string): Promise<boolean>;
  
  getSiteSettings(): Promise<SiteSettings | undefined>;
  upsertSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (!db) throw new Error("Database not available");
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

  async getProjects(): Promise<Project[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(projects)
      .orderBy(desc(projects.sortOrder), desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    if (!db) throw new Error("Database not available");
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getPublishedProjects(): Promise<Project[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(desc(projects.sortOrder), desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    if (!db) throw new Error("Database not available");
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(
    id: string,
    projectData: Partial<InsertProject>
  ): Promise<Project | undefined> {
    if (!db) throw new Error("Database not available");
    const [updatedProject] = await db
      .update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async getAboutContent(): Promise<About | undefined> {
    if (!db) throw new Error("Database not available");
    const [about] = await db.select().from(aboutContent).limit(1);
    return about;
  }

  async upsertAboutContent(about: InsertAbout): Promise<About> {
    if (!db) throw new Error("Database not available");
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

  async getContactMessages(): Promise<ContactMessage[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    if (!db) throw new Error("Database not available");
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async markMessageAsRead(id: string): Promise<ContactMessage | undefined> {
    if (!db) throw new Error("Database not available");
    const [updated] = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }

  async replyToMessage(id: string, reply: string): Promise<ContactMessage | undefined> {
    if (!db) throw new Error("Database not available");
    const [updated] = await db
      .update(contactMessages)
      .set({ reply, repliedAt: new Date(), isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return result.length > 0;
  }

  async getProjectImages(projectId: string): Promise<ProjectImage[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectId, projectId))
      .orderBy(asc(projectImages.sortOrder));
  }

  async addProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
    if (!db) throw new Error("Database not available");
    const [created] = await db.insert(projectImages).values(image).returning();
    return created;
  }

  async updateProjectImageOrder(id: string, sortOrder: number): Promise<ProjectImage | undefined> {
    if (!db) throw new Error("Database not available");
    const [updated] = await db
      .update(projectImages)
      .set({ sortOrder })
      .where(eq(projectImages.id, id))
      .returning();
    return updated;
  }

  async deleteProjectImage(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(projectImages).where(eq(projectImages.id, id)).returning();
    return result.length > 0;
  }

  async getSiteSettings(): Promise<SiteSettings | undefined> {
    if (!db) throw new Error("Database not available");
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings;
  }

  async upsertSiteSettings(settingsData: InsertSiteSettings): Promise<SiteSettings> {
    if (!db) throw new Error("Database not available");
    const existing = await this.getSiteSettings();
    
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ ...settingsData, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siteSettings).values(settingsData).returning();
      return created;
    }
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private aboutContentData: About | undefined;
  private contactMessagesData: Map<string, ContactMessage> = new Map();
  private projectImagesData: Map<string, ProjectImage> = new Map();
  private siteSettingsData: SiteSettings | undefined;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const isFirstUser = this.users.size === 0;
    const now = new Date();
    
    if (userData.id && this.users.has(userData.id)) {
      const existing = this.users.get(userData.id)!;
      const updated: User = {
        ...existing,
        ...userData,
        updatedAt: now,
      };
      this.users.set(userData.id, updated);
      return updated;
    } else {
      const user: User = {
        id: userData.id || generateId(),
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        isAdmin: isFirstUser ? true : (userData.isAdmin || false),
        createdAt: now,
        updatedAt: now,
      };
      this.users.set(user.id, user);
      return user;
    }
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return (b.sortOrder || 0) - (a.sortOrder || 0);
      return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getPublishedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(p => p.published)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return (b.sortOrder || 0) - (a.sortOrder || 0);
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      });
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: generateId(),
      title: projectData.title,
      description: projectData.description || null,
      shortDescription: projectData.shortDescription || null,
      imageUrl: projectData.imageUrl || null,
      tags: projectData.tags || [],
      category: projectData.category || null,
      externalUrl: projectData.externalUrl || null,
      githubUrl: projectData.githubUrl || null,
      technologies: projectData.technologies || [],
      role: projectData.role || null,
      year: projectData.year || null,
      featured: projectData.featured || false,
      published: projectData.published !== undefined ? projectData.published : true,
      sortOrder: projectData.sortOrder || 0,
      userId: projectData.userId || null,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: string, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...projectData,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getAboutContent(): Promise<About | undefined> {
    return this.aboutContentData;
  }

  async upsertAboutContent(aboutData: InsertAbout): Promise<About> {
    const now = new Date();
    
    if (this.aboutContentData) {
      this.aboutContentData = {
        ...this.aboutContentData,
        ...aboutData,
        updatedAt: now,
      };
    } else {
      this.aboutContentData = {
        id: generateId(),
        title: aboutData.title || null,
        subtitle: aboutData.subtitle || null,
        bio: aboutData.bio || null,
        photoUrl: aboutData.photoUrl || null,
        resumeUrl: aboutData.resumeUrl || null,
        skills: aboutData.skills || [],
        socialLinks: aboutData.socialLinks || {},
        createdAt: now,
        updatedAt: now,
      };
    }
    return this.aboutContentData;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesData.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const message: ContactMessage = {
      id: generateId(),
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject || null,
      message: messageData.message,
      isRead: false,
      reply: messageData.reply || null,
      repliedAt: messageData.repliedAt || null,
      createdAt: new Date(),
    };
    this.contactMessagesData.set(message.id, message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<ContactMessage | undefined> {
    const message = this.contactMessagesData.get(id);
    if (!message) return undefined;

    message.isRead = true;
    this.contactMessagesData.set(id, message);
    return message;
  }

  async replyToMessage(id: string, reply: string): Promise<ContactMessage | undefined> {
    const message = this.contactMessagesData.get(id);
    if (!message) return undefined;

    message.reply = reply;
    message.repliedAt = new Date();
    message.isRead = true;
    this.contactMessagesData.set(id, message);
    return message;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    return this.contactMessagesData.delete(id);
  }

  async getProjectImages(projectId: string): Promise<ProjectImage[]> {
    return Array.from(this.projectImagesData.values())
      .filter(img => img.projectId === projectId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async addProjectImage(imageData: InsertProjectImage): Promise<ProjectImage> {
    const image: ProjectImage = {
      id: generateId(),
      projectId: imageData.projectId,
      imageUrl: imageData.imageUrl,
      caption: imageData.caption || null,
      sortOrder: imageData.sortOrder || 0,
      createdAt: new Date(),
    };
    this.projectImagesData.set(image.id, image);
    return image;
  }

  async updateProjectImageOrder(id: string, sortOrder: number): Promise<ProjectImage | undefined> {
    const image = this.projectImagesData.get(id);
    if (!image) return undefined;

    image.sortOrder = sortOrder;
    this.projectImagesData.set(id, image);
    return image;
  }

  async deleteProjectImage(id: string): Promise<boolean> {
    return this.projectImagesData.delete(id);
  }

  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.siteSettingsData;
  }

  async upsertSiteSettings(settingsData: InsertSiteSettings): Promise<SiteSettings> {
    const now = new Date();
    
    if (this.siteSettingsData) {
      this.siteSettingsData = {
        ...this.siteSettingsData,
        ...settingsData,
        updatedAt: now,
      };
    } else {
      this.siteSettingsData = {
        id: generateId(),
        greetingName: settingsData.greetingName || "Filadelfi",
        greetingPrefix: settingsData.greetingPrefix || "Привет, я",
        heroTitle: settingsData.heroTitle || "Создаю",
        heroHighlight: settingsData.heroHighlight || "цифровые чудеса",
        heroDescription: settingsData.heroDescription || null,
        worksTitle: settingsData.worksTitle || "Мои работы",
        worksSubtitle: settingsData.worksSubtitle || null,
        createdAt: now,
        updatedAt: now,
      };
    }
    return this.siteSettingsData;
  }
}

export const storage: IStorage = db ? new DatabaseStorage() : new MemStorage();

console.log(`Storage initialized: ${db ? 'DatabaseStorage (PostgreSQL)' : 'MemStorage (in-memory)'}`);
