import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table for portfolio items
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  imageUrl: varchar("image_url"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  category: varchar("category", { length: 100 }),
  externalUrl: varchar("external_url"),
  githubUrl: varchar("github_url"),
  technologies: text("technologies").array().default(sql`'{}'::text[]`),
  role: varchar("role", { length: 255 }),
  year: integer("year"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  sortOrder: integer("sort_order").default(0),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

// About/Profile content table
export const aboutContent = pgTable("about_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 500 }),
  bio: text("bio"),
  photoUrl: varchar("photo_url"),
  resumeUrl: varchar("resume_url"),
  skills: text("skills").array().default(sql`'{}'::text[]`),
  socialLinks: jsonb("social_links").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  reply: text("reply"),
  repliedAt: timestamp("replied_at"),
  conversationToken: varchar("conversation_token", { length: 64 }),
  userReplyCount: integer("user_reply_count").default(0),
  lastUserReplyAt: timestamp("last_user_reply_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Conversation replies table for secure message threading
export const conversationReplies = pgTable("conversation_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").references(() => contactMessages.id, { onDelete: "cascade" }).notNull(),
  authorType: varchar("author_type", { length: 10 }).notNull(), // 'user' or 'admin'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project images table for multiple images per project
export const projectImages = pgTable("project_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  imageUrl: varchar("image_url").notNull(),
  caption: varchar("caption", { length: 500 }),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site settings table for hero section and branding
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  greetingName: varchar("greeting_name", { length: 100 }).default("Filadelfi"),
  greetingPrefix: varchar("greeting_prefix", { length: 100 }).default("Привет, я"),
  heroTitle: varchar("hero_title", { length: 255 }).default("Создаю"),
  heroHighlight: varchar("hero_highlight", { length: 255 }).default("цифровые чудеса"),
  heroDescription: text("hero_description"),
  worksTitle: varchar("works_title", { length: 255 }).default("Мои работы"),
  worksSubtitle: text("works_subtitle"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Additional relations
export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

// Schemas and Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const insertAboutSchema = createInsertSchema(aboutContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAbout = z.infer<typeof insertAboutSchema>;
export type About = typeof aboutContent.$inferSelect;

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  isRead: true,
  conversationToken: true,
  reply: true,
  repliedAt: true,
  userReplyCount: true,
  lastUserReplyAt: true,
});
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const insertConversationReplySchema = createInsertSchema(conversationReplies).omit({
  id: true,
  createdAt: true,
});
export type InsertConversationReply = z.infer<typeof insertConversationReplySchema>;
export type ConversationReply = typeof conversationReplies.$inferSelect;

export const insertProjectImageSchema = createInsertSchema(projectImages).omit({
  id: true,
  createdAt: true,
});
export type InsertProjectImage = z.infer<typeof insertProjectImageSchema>;
export type ProjectImage = typeof projectImages.$inferSelect;

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
