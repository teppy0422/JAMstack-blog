import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import path from "path";

const upload = multer({ dest: "/tmp" });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join("/tmp", req.file.originalname);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).json({ error: "Error moving file" });

    res.status(200).json({ data: "success", filePath: targetPath });
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
