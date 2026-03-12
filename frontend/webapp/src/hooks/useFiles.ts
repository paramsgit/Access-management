import { useEffect, useState } from "react";
import { getFiles, type File } from "@/api/files.api";

type UseFilesResult = {
  files: File[];
  loading: boolean;
  error: string | null;
};

export function useFiles(): UseFilesResult {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getFiles();

        if (isMounted) {
          setFiles(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load files");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFiles();

    return () => {
      isMounted = false;
    };
  }, []);

  return { files, loading, error };
}
