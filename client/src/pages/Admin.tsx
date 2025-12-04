import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ObjectUploader } from "@/components/ObjectUploader";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import {
  Sparkles,
  Home,
  Plus,
  Pencil,
  Trash2,
  Image,
  Loader2,
  LogOut,
  Eye,
  EyeOff,
  X,
  GripVertical,
} from "lucide-react";
import type { Project, ProjectImage, About } from "@shared/schema";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  imageUrl: z.string().optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  technologies: z.string().optional(),
  role: z.string().optional(),
  year: z.coerce.number().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);


  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects"],
    enabled: !!user?.isAdmin,
  });

  const { data: aboutContent } = useQuery<About>({
    queryKey: ["/api/about"],
  });

  // Sync local projects with fetched data
  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDescription: "",
      imageUrl: "",
      tags: "",
      category: "",
      externalUrl: "",
      githubUrl: "",
      technologies: "",
      role: "",
      year: new Date().getFullYear(),
      featured: false,
      published: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
        technologies: data.technologies
          ? data.technologies.split(",").map((t) => t.trim())
          : [],
        externalUrl: data.externalUrl || null,
        githubUrl: data.githubUrl || null,
      };
      return apiRequest("POST", "/api/projects", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project created successfully" });
      setIsDialogOpen(false);
      form.reset();
      setUploadedImageUrl("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ProjectFormData;
    }) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
        technologies: data.technologies
          ? data.technologies.split(",").map((t) => t.trim())
          : [],
        externalUrl: data.externalUrl || null,
        githubUrl: data.githubUrl || null,
      };
      return apiRequest("PATCH", `/api/projects/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project updated successfully" });
      setIsDialogOpen(false);
      setEditingProject(null);
      form.reset();
      setUploadedImageUrl("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      return apiRequest("PATCH", `/api/projects/${id}`, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (projectOrders: { id: string; sortOrder: number }[]) => {
      return apiRequest("PATCH", "/api/projects/reorder", { projectOrders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Projects reordered successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      // Revert local state on error
      setLocalProjects(projects);
      toast({
        title: "Error",
        description: "Failed to reorder projects",
        variant: "destructive",
      });
    },
  });

  const addProjectImageMutation = useMutation({
    mutationFn: async ({ projectId, imageUrl, caption }: { projectId: string; imageUrl: string; caption?: string }) => {
      return apiRequest("POST", `/api/projects/${projectId}/images`, { imageUrl, caption });
    },
    onSuccess: async () => {
      if (editingProject) {
        // Refetch project images
        try {
          const response = await fetch(`/api/projects/${editingProject.id}/images`);
          const images = await response.json();
          setProjectImages(images);
        } catch (error) {
          console.error("Error fetching project images:", error);
        }
      }
      toast({ title: "Image added successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      });
    },
  });

  const deleteProjectImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      return apiRequest("DELETE", `/api/project-images/${imageId}`);
    },
    onSuccess: async () => {
      if (editingProject) {
        // Refetch project images
        try {
          const response = await fetch(`/api/projects/${editingProject.id}/images`);
          const images = await response.json();
          setProjectImages(images);
        } catch (error) {
          console.error("Error fetching project images:", error);
        }
      }
      toast({ title: "Image deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  const handleEdit = async (project: Project) => {
    setEditingProject(project);
    form.reset({
      title: project.title,
      description: project.description || "",
      shortDescription: project.shortDescription || "",
      imageUrl: project.imageUrl || "",
      tags: project.tags?.join(", ") || "",
      category: project.category || "",
      externalUrl: project.externalUrl || "",
      githubUrl: project.githubUrl || "",
      technologies: project.technologies?.join(", ") || "",
      role: project.role || "",
      year: project.year || new Date().getFullYear(),
      featured: project.featured || false,
      published: project.published ?? true,
    });
    setUploadedImageUrl(project.imageUrl || "");
    
    // Fetch project images
    try {
      const response = await fetch(`/api/projects/${project.id}/images`);
      const images = await response.json();
      setProjectImages(images);
    } catch (error) {
      console.error("Error fetching project images:", error);
      setProjectImages([]);
    }
    
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: ProjectFormData) => {
    const formData = {
      ...data,
      imageUrl: uploadedImageUrl || data.imageUrl,
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", { method: "POST" });
    const { uploadURL } = await response.json();
    return { method: "PUT" as const, url: uploadURL };
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful?.[0]?.uploadURL) {
      try {
        const response = await apiRequest("PUT", "/api/project-images", {
          imageURL: result.successful[0].uploadURL,
        });
        const data = await response.json();
        setUploadedImageUrl(data.objectPath);
        form.setValue("imageUrl", data.objectPath);
        toast({ title: "Image uploaded successfully" });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process uploaded image",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    form.reset();
    setUploadedImageUrl("");
    setProjectImages([]);
  };

  // Handler for adding gallery images
  const handleGalleryUploadComplete = async (result: any) => {
    if (result.successful?.[0]?.uploadURL && editingProject) {
      try {
        const response = await apiRequest("PUT", "/api/project-images", {
          imageURL: result.successful[0].uploadURL,
        });
        const data = await response.json();
        
        // Add the image to the project
        addProjectImageMutation.mutate({
          projectId: editingProject.id,
          imageUrl: data.objectPath,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process uploaded image",
          variant: "destructive",
        });
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = useCallback((projectId: string) => {
    setDraggedProject(projectId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((targetProjectId: string) => {
    if (!draggedProject || draggedProject === targetProjectId) {
      setDraggedProject(null);
      return;
    }

    const draggedIndex = localProjects.findIndex(p => p.id === draggedProject);
    const targetIndex = localProjects.findIndex(p => p.id === targetProjectId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedProject(null);
      return;
    }

    // Create new array with reordered projects
    const newProjects = [...localProjects];
    const [removed] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, removed);

    // Update local state immediately for smooth UX
    setLocalProjects(newProjects);
    setDraggedProject(null);

    // Send reorder request to server
    const projectOrders = newProjects.map((project, index) => ({
      id: project.id,
      sortOrder: newProjects.length - index, // Higher number = higher priority
    }));

    reorderMutation.mutate(projectOrders);
  }, [draggedProject, localProjects, reorderMutation]);

  const handleDragEnd = useCallback(() => {
    setDraggedProject(null);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please sign in to access the admin panel.
            </p>
            <Button asChild className="w-full" data-testid="button-login-admin">
              <a href="/api/login">Sign In with Replit</a>
            </Button>
            <Button variant="outline" asChild className="w-full" data-testid="button-back-home">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <X className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have admin access. Contact the site owner for permissions.
            </p>
            <Button variant="outline" asChild className="w-full" data-testid="button-back-home-denied">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Portfolio</span>
            </Link>
            <Badge variant="secondary">Admin</Badge>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeToggle />
            <PDFDownloadButton
              projects={localProjects.filter(p => p.published)}
              aboutContent={aboutContent}
              ownerName={aboutContent?.title || "Portfolio"}
              variant="outline"
              size="sm"
            />
            <Link href="/gallery">
              <Button variant="outline" size="sm" data-testid="button-view-portfolio">
                <Home className="h-4 w-4 mr-2" />
                View Portfolio
              </Button>
            </Link>
            <Button variant="ghost" size="sm" asChild data-testid="button-logout-admin">
              <a href="/api/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Manage Projects</h1>
              <p className="text-muted-foreground mt-1">
                Add, edit, and organize your portfolio projects
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingProject(null);
                    form.reset();
                    setUploadedImageUrl("");
                    setIsDialogOpen(true);
                  }}
                  data-testid="button-add-project"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 items-start">
                        <Label>Project Image</Label>
                        {uploadedImageUrl ? (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={uploadedImageUrl}
                              alt="Project preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setUploadedImageUrl("");
                                form.setValue("imageUrl", "");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full">
                            <ObjectUploader
                              maxNumberOfFiles={1}
                              maxFileSize={10485760}
                              onGetUploadParameters={handleGetUploadParameters}
                              onComplete={handleUploadComplete}
                              buttonVariant="outline"
                              buttonClassName="w-full h-32 border-dashed"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Image className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Click to upload image
                                </span>
                              </div>
                            </ObjectUploader>
                          </div>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Project title"
                                {...field}
                                data-testid="input-project-title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Brief description for cards"
                                {...field}
                                data-testid="input-short-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Detailed project description"
                                rows={4}
                                {...field}
                                data-testid="input-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Web Design"
                                  {...field}
                                  data-testid="input-category"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="2024"
                                  {...field}
                                  data-testid="input-year"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="react, typescript, design (comma separated)"
                                {...field}
                                data-testid="input-tags"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="technologies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technologies</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="React, Node.js, PostgreSQL (comma separated)"
                                {...field}
                                data-testid="input-technologies"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Role</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Lead Developer"
                                {...field}
                                data-testid="input-role"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="externalUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Live URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://..."
                                  {...field}
                                  data-testid="input-external-url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="githubUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://github.com/..."
                                  {...field}
                                  data-testid="input-github-url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <FormField
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-featured"
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">Featured</FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="published"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-published"
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">Published</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      {editingProject && (
                        <div className="pt-4 border-t">
                          <Label className="mb-3 block">Additional Gallery Images</Label>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            {projectImages.map((image) => (
                              <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                                <img
                                  src={image.imageUrl}
                                  alt={image.caption || "Gallery image"}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => deleteProjectImageMutation.mutate(image.id)}
                                  data-testid={`button-delete-gallery-image-${image.id}`}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <ObjectUploader
                            maxNumberOfFiles={1}
                            maxFileSize={10485760}
                            onGetUploadParameters={handleGetUploadParameters}
                            onComplete={handleGalleryUploadComplete}
                            buttonVariant="outline"
                            buttonClassName="w-full h-20 border-dashed"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <Plus className="h-5 w-5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Add gallery image
                              </span>
                            </div>
                          </ObjectUploader>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDialogClose}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                        data-testid="button-save-project"
                      >
                        {(createMutation.isPending ||
                          updateMutation.isPending) && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {editingProject ? "Update" : "Create"} Project
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : localProjects.length === 0 ? (
            <Card className="py-20">
              <CardContent className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first project to get started
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                Drag to reorder projects
              </div>
              {localProjects.map((project) => (
                <Card 
                  key={project.id} 
                  data-testid={`admin-card-project-${project.id}`}
                  draggable
                  onDragStart={() => handleDragStart(project.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(project.id)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move transition-all ${
                    draggedProject === project.id 
                      ? 'opacity-50 border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground"
                        data-testid={`drag-handle-${project.id}`}
                      >
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl font-bold">
                            {project.title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">
                            {project.title}
                          </h3>
                          {project.featured && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          )}
                          {!project.published && (
                            <Badge variant="outline" className="text-xs">
                              Draft
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.shortDescription || project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            togglePublishMutation.mutate({
                              id: project.id,
                              published: !project.published,
                            })
                          }
                          data-testid={`button-toggle-publish-${project.id}`}
                        >
                          {project.published ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(project)}
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-testid={`button-delete-${project.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{project.title}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(project.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                data-testid={`button-confirm-delete-${project.id}`}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
