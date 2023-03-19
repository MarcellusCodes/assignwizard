import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { addAssignmentSchema } from "~/schemas";
import type { AddAssignment } from "~/types";

const AddAssignmentForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddAssignment>({
    resolver: zodResolver(addAssignmentSchema),
  });
  const utils = api.useContext();

  const addAssignment = api.assignment.add.useMutation({
    onSuccess: async () => {
      await utils.assignment.getAll.invalidate();
      reset({
        title: "",
        description: "",
        deadline: "",
        protected: false,
        password: "",
      });
    },
  });

  const handleAddAssignment = (data: AddAssignment) => {
    addAssignment.mutate({
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
        <button type="submit">Add</button>
      </Form.Submit>
    </Form.Root>
  );
};

export default AddAssignmentForm;
