import { api } from "~/utils/api";

const useDeleteAssignment = () => {
  const utils = api.useContext();
  const deleteAssignment = api.assignment.delete.useMutation({
    onSuccess: async () => {
      await utils.assignment.getAll.invalidate();
    },
  });
  return deleteAssignment;
};

export default useDeleteAssignment;
