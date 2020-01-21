import { Dispatch, SetStateAction } from 'react';

export type ModalState = {
  visible: boolean;
};

export type FormState = {
  text: string;
  isUrgent: boolean;
};

export type ToggleModal = Dispatch<SetStateAction<ModalState>>;

export type SetFormState = Dispatch<SetStateAction<FormState>>;

export type ModalContext = {
  toggleModal: ToggleModal;
  visible: boolean;
};

export type Context = {
  modal: ModalContext;
  form: FormContext;
};

export type FormContext = {
  text: string;
  isUrgent: boolean;
  setFormState: SetFormState;
};
