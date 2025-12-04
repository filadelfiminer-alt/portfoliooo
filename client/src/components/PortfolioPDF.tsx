import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";
import type { Project, About } from "@shared/schema";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 11,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    backgroundColor: "#FFFFFF",
  },
  coverPage: {
    fontFamily: "Inter",
    backgroundColor: "#0F172A",
    padding: 50,
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 18,
    color: "#94A3B8",
    marginBottom: 40,
    textAlign: "center",
  },
  coverPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
    objectFit: "cover",
  },
  coverName: {
    fontSize: 24,
    fontWeight: 600,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  aboutBio: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 1.6,
  },
  projectCard: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0F172A",
    flex: 1,
  },
  projectYear: {
    fontSize: 10,
    color: "#64748B",
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  projectRole: {
    fontSize: 11,
    color: "#3B82F6",
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    fontSize: 9,
    color: "#3B82F6",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  techContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tech: {
    fontSize: 9,
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  projectLinks: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  link: {
    fontSize: 10,
    color: "#3B82F6",
    textDecoration: "none",
  },
  projectImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 6,
    marginBottom: 12,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#94A3B8",
  },
  pageNumber: {
    fontSize: 9,
    color: "#64748B",
  },
  contactSection: {
    marginTop: 20,
  },
  contactItem: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 6,
  },
});

interface PortfolioPDFProps {
  projects: Project[];
  aboutContent?: About | null;
  ownerName?: string;
}

export function PortfolioPDF({ projects, aboutContent, ownerName = "Portfolio" }: PortfolioPDFProps) {
  const currentYear = new Date().getFullYear();
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <Document title={`${ownerName} Portfolio`} author={ownerName}>
      <Page size="A4" style={styles.coverPage}>
        {aboutContent?.photoUrl && (
          <Image src={aboutContent.photoUrl} style={styles.coverPhoto} />
        )}
        <Text style={styles.coverName}>{aboutContent?.title || ownerName}</Text>
        <Text style={styles.coverTitle}>Portfolio</Text>
        <Text style={styles.coverSubtitle}>
          {projects.length} Projects | {currentYear}
        </Text>
      </Page>

      {aboutContent && aboutContent.bio && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.aboutBio}>{aboutContent.bio}</Text>
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>{ownerName} Portfolio</Text>
          </View>
        </Page>
      )}

      {featuredProjects.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            {featuredProjects.map((project) => (
              <View key={project.id} style={styles.projectCard} wrap={false}>
                {project.imageUrl && (
                  <Image src={project.imageUrl} style={styles.projectImage} />
                )}
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  {project.year && (
                    <Text style={styles.projectYear}>{project.year}</Text>
                  )}
                </View>
                {project.role && (
                  <Text style={styles.projectRole}>{project.role}</Text>
                )}
                {project.shortDescription && (
                  <Text style={styles.projectDescription}>
                    {project.shortDescription}
                  </Text>
                )}
                {project.tags && project.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {project.tags.map((tag) => (
                      <Text key={tag} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <View style={styles.techContainer}>
                    {project.technologies.map((tech) => (
                      <Text key={tech} style={styles.tech}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={styles.projectLinks}>
                  {project.externalUrl && (
                    <Link src={project.externalUrl} style={styles.link}>
                      View Live
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link src={project.githubUrl} style={styles.link}>
                      GitHub
                    </Link>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>{ownerName} Portfolio</Text>
          </View>
        </Page>
      )}

      {otherProjects.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Projects</Text>
            {otherProjects.map((project) => (
              <View key={project.id} style={styles.projectCard} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  {project.year && (
                    <Text style={styles.projectYear}>{project.year}</Text>
                  )}
                </View>
                {project.role && (
                  <Text style={styles.projectRole}>{project.role}</Text>
                )}
                {project.shortDescription && (
                  <Text style={styles.projectDescription}>
                    {project.shortDescription}
                  </Text>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <View style={styles.techContainer}>
                    {project.technologies.map((tech) => (
                      <Text key={tech} style={styles.tech}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={styles.projectLinks}>
                  {project.externalUrl && (
                    <Link src={project.externalUrl} style={styles.link}>
                      View Live
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link src={project.githubUrl} style={styles.link}>
                      GitHub
                    </Link>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>{ownerName} Portfolio</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
