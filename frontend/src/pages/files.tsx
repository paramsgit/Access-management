import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const files = [
  { id: 1, name: "resume.pdf", type: "PDF" },
  { id: 2, name: "invoice.xlsx", type: "Excel" },
  { id: 3, name: "photo.png", type: "Image" },
];

export default function FilesPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Files</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {files.map((file) => (
          <Card key={file.id}>
            <CardHeader>
              <CardTitle>{file.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {file.type}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
