import React, { createContext, ReactElement, ReactNode, useState } from "react";

import { Context, ToggleModal } from "./types";


const initialContext: Context = {
	modal: {
		toggleModal: (): void => {
			throw new Error("toggleModal function must be overridden");
		},
		visible: false,
	},
	dropdown: {
		category: "",
		setCategory: (): void => {
			throw new Error("setCategory function must be overridden");
		},
	},
	form: {
		date: new Date(),
		description: "",
		title: "",
		setFormState: (): void => {
			throw new Error("setFormState function must be overridden");
		},
	},
};

export const NewsContext = createContext<Context>(initialContext);

export default ({ children }: { children: ReactNode }): ReactElement => {
	// CreateNewsItem Modal state
	const [{ visible }, setModalState] = useState({ visible: false });
	const toggleModal: ToggleModal = () => setModalState({ visible: !visible });

	// CreateNewsItem Category Dropdown state
	const [category, setCategory] = useState("Types");

	// CreateNewsItem Form state
	const [{ date, description, title }, setFormState] = useState({
		date: new Date(),
		description: "",
		title: "",
	});

	const store = {
		modal: {
			toggleModal,
			visible,
		},
		dropdown: {
			category,
			setCategory,
		},
		form: {
			date,
			description,
			title,
			setFormState,
		},
	};

	return <NewsContext.Provider value={store}>{children}</NewsContext.Provider>
};
