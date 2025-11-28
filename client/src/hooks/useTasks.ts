import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { Taskable } from "../typings/Taskable";

export const useTasks = () => {
  const tasksQuery = useQuery<Taskable[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });

  const createTask = useMutation({
    mutationFn: async (dto: Partial<Taskable>) => {
      const res = await api.post("/tasks", dto);
      return res.data;
    },
    onSuccess: () => tasksQuery.refetch(),
  });

  const updateTask = useMutation({
    mutationFn: async (params: { id: string; dto: Partial<Taskable> }) => {
      const res = await api.patch(`/tasks/${params.id}`, params.dto);
      return res.data;
    },
    onSuccess: () => tasksQuery.refetch(),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => tasksQuery.refetch(),
  });

  return { tasksQuery, createTask, updateTask, deleteTask };
};
