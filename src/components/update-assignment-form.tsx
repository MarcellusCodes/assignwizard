import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { updateAssignmentSchema } from "~/schemas";
import type { AddAssignment } from "~/types";

const UpdateAssignmentForm = ({ id }: { id: string }) => {
  const { data: assignment, isLoading: isLoading } =
    api.assignment.get.useQuery({ id });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddAssignment>({
    resolver: zodResolver(updateAssignmentSchema),
    defaultValues: {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      deadline: new Date(assignment.deadline.toLocaleDateString()),
      protected: assignment.protected,
      password: assignment.password || "",
    },
  });
  const utils = api.useContext();

  const updateAssignment = api.assignment.update.useMutation({
    onSuccess: async (success) => {
      await utils.assignment.get.invalidate({ id: id });
      console.log(assignment, success);
      reset((formValues) => ({
        ...formValues,
      }));
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleAddAssignment = (data: AddAssignment) => {
    updateAssignment.mutate({
      id: assignment.id,
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      protected: data.protected,
      password: data.password || "",
    });
  };
  const onSubmit = handleSubmit((data) => handleAddAssignment(data));
  const watchProtected = watch("protected");
  return (
    <Form.Root
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="FormRoot"
    >
      <Form.Field name="title">
        <Form.Label>Title</Form.Label>
        <Form.Control asChild>
          <input {...register("title")} type="text" />
        </Form.Control>
        <Form.Message>
          Please provide a valid title: {errors.title?.message}
        </Form.Message>
      </Form.Field>
      <Form.Field name="description">
        <Form.Label>Description</Form.Label>
        <Form.Control asChild>
          <textarea {...register("description")} />
        </Form.Control>
        <Form.Message>
          Please enter a valid description: {errors.description?.message}
        </Form.Message>
      </Form.Field>
      <Form.Field name="deadline">
        <Form.Label>Deadline</Form.Label>
        <Form.Control asChild>
          <input type="date" {...register("deadline")} />
        </Form.Control>
        <Form.Message>
          Please provide a valid deadline: {errors.deadline?.message}
        </Form.Message>
      </Form.Field>
      <Form.Field name="protected">
        <Form.Label>Protected</Form.Label>
        <Form.Control asChild>
          <input type="checkbox" {...register("protected")} />
        </Form.Control>
      </Form.Field>
      {watchProtected && (
        <Form.Field name="password">
          <Form.Label>Password</Form.Label>
          <Form.Control asChild>
            <input type="password" {...register("password")} />
          </Form.Control>
          <Form.Message>
            Please provide a valid password: {errors.password?.message}
          </Form.Message>
        </Form.Field>
      )}
      <Form.Submit asChild>
        <button type="submit">
          {updateAssignment.isLoading ? "Updating..." : "Update"}
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default UpdateAssignmentForm;
