import { Dispatch, SetStateAction } from "react";

export type ModalState = {
	visible: boolean;
};

export type FormState = {
	date: Date;
	description: string;
	title: string;
};

export type ToggleModal = Dispatch<SetStateAction<ModalState>>;

export type SetCategory = Dispatch<SetStateAction<string>>;

export type SetFormState = Dispatch<SetStateAction<FormState>>;

export type ModalContext = {
	toggleModal: ToggleModal;
	visible: boolean;
};

export type DropdownContext = {
	category: string;
	setCategory: SetCategory;
};

export type FormContext = {
	date: Date;
	description: string;
	title: string;
	setFormState: SetFormState;
};

export type Context = {
	modal: ModalContext;
	dropdown: DropdownContext;
	form: FormContext;
};
