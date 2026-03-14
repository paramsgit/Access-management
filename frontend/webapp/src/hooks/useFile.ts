import { useQuery } from "@tanstack/react-query";
import { getSingleFile, type File } from "@/api/files.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFileContent } from "@/api/files.api";
export function useFile(id: string, include?: string) {
  return useQuery<File>({
    queryKey: ["file", id],
    queryFn: () => getSingleFile(id, include),
    enabled: !!id,
  });
}

export function useUpdateFileContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateFileContent(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["file", variables.id] });
    },
  });
}
