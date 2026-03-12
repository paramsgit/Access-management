import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFiles } from "@/hooks/useFiles";

export default function FilesPage() {
  const { files, loading, error } = useFiles();

  if (loading) {
    return <div className="p-6">Loading files...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Files</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {files.map((file) => (
          <Card key={file.id} className={file.isPermission ? "" : "opacity-60"}>
            <CardHeader>
              <CardTitle className="text-lg">{file.fileName}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {file.isPermission ? (
                <span className="text-green-600">✓ You have access</span>
              ) : (
                <span className="text-red-600">✗ No access</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
