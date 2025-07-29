import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

const chatroomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title must be less than 50 characters'),
});

type ChatroomForm = z.infer<typeof chatroomSchema>;

interface CreateChatroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export const CreateChatroomModal: React.FC<CreateChatroomModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChatroomForm>({
    resolver: zodResolver(chatroomSchema),
  });

  const handleFormSubmit = (data: ChatroomForm) => {
    onSubmit(data.title);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Chatroom">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          {...register('title')}
          label="Chatroom Title"
          placeholder="Enter chatroom title"
          error={errors.title?.message}
          autoFocus
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Chatroom
          </Button>
        </div>
      </form>
    </Modal>
  );
};