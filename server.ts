import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import multer from "multer";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Initialize a simple JSON-based store for projects
const DATA_FILE = path.join(process.cwd(), "data.json");
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify([
      {
        id: "1",
        title: "Solar Borehole Construction",
        description: "Provision of clean water across various wards in Kaduna North.",
        mediaUrl: "https://images.unsplash.com/photo-1541888071854-3e9a594892c5?auto=format&fit=crop&w=1000&q=80",
        mediaType: "image",
        date: "2023-10-12",
      },
      {
        id: "2",
        title: "Youth Empowerment Program",
        description: "Distribution of empowerment materials to artisans and entrepreneurs.",
        mediaUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1000&q=80",
        mediaType: "image",
        date: "2023-11-05",
      }
    ])
  );
}

function getProjects() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function saveProjects(projects: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(UPLOADS_DIR));

  // API Routes
  app.get("/api/projects", (req, res) => {
    try {
      res.json(getProjects());
    } catch (err: any) {
      console.error("Error reading projects:", err);
      res.status(500).json({ error: "Failed to load achievements list" });
    }
  });

  app.post("/api/projects", upload.single("mediaFile"), (req, res) => {
    try {
      console.log("POST /api/projects received. Body:", req.body);
      console.log("Uploaded file context:", req.file);

      const { title, description, mediaType, date } = req.body;
      let { mediaUrl } = req.body;

      if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
      }

      if (!title || !title.trim()) {
        return res.status(400).json({ error: "Achievement title is required." });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({ error: "Description and key highlights are required." });
      }

      if (!mediaUrl || !mediaUrl.trim()) {
        return res.status(400).json({ error: "Please select a file to upload or provide a valid web URL." });
      }

      const projects = getProjects();
      const newProject = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        mediaUrl: mediaUrl.trim(),
        mediaType: mediaType || 'image',
        date: date || new Date().toISOString().split('T')[0]
      };

      projects.push(newProject);
      saveProjects(projects);
      console.log("Success: New project added:", newProject);
      res.status(201).json(newProject);
    } catch (err: any) {
      console.error("Error inside POST /api/projects:", err);
      res.status(500).json({ error: err.message || "An unexpected error occurred on the server." });
    }
  });
  
  app.delete("/api/projects/:id", (req, res) => {
    try {
      const { id } = req.params;
      console.log(`DELETE /api/projects/${id} triggered.`);
      
      const projects = getProjects();
      const index = projects.findIndex((p: any) => p.id === id);
      
      if (index === -1) {
        return res.status(404).json({ error: "Project achievement not found." });
      }

      const updatedProjects = projects.filter((p: any) => p.id !== id);
      saveProjects(updatedProjects);
      console.log(`Success: Project achievement ${id} deleted.`);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      console.error("Error inside DELETE /api/projects:", err);
      res.status(500).json({ error: "Failed to delete the achievement." });
    }
  });

  // Centralized Error Handling Middleware (e.g. catches Multer file limit errors)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled middleware error:", err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      error: err.message || "An error occurred on the server while parsing the upload data."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
