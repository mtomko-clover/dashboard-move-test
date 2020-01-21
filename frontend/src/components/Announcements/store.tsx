import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { Context, ToggleModal } from './types';

const initialContext: Context = {
  modal: {
    toggleModal: (): void => {
      throw new Error('toggleModal function must be overridden');
    },
    visible: false,
  },
  form: {
    text: '',
    isUrgent: false,
    setFormState: (): void => {
      throw new Error('setFormState function must be overridden');
    },
  },
};

export const AnnouncementContext = createContext<Context>(initialContext);

export default ({ children }: { children: ReactNode }): ReactElement => {
  const [{ visible }, setModalState] = useState({ visible: false });
  const toggleModal: ToggleModal = () => setModalState({ visible: !visible });

  // CreateNewsItem form state
  const [{ text, isUrgent }, setFormState] = useState({
    text: '',
    isUrgent: false,
  });

  const store = {
    modal: {
      toggleModal,
      visible,
    },
    form: {
      text,
      isUrgent,
      setFormState,
    },
  };

  return <AnnouncementContext.Provider value={store}>{children}</AnnouncementContext.Provider>;
};
