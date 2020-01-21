import { DocumentNode } from 'graphql';
import { Moment } from 'moment';
import { Dispatch, SetStateAction } from 'react';

export type Datum = {
  query: DocumentNode;
  title: string;
};

export interface AppApprovalsState {
  appsApproved: Datum;
  appsPending: Datum;
  appsSubmitted: Datum;
  appsRejected: Datum;
}

export interface DevApprovalsState {
  devsApproved: Datum;
  devsPending: Datum;
  devsSubmitted: Datum;
  devsRejected: Datum;
}

export interface CommunityState {
  questions: Datum;
  answers: Datum;
}

export type Card = {
  key: string;
  title: string;
  selected: boolean;
};

export type CardOne = Card & {
  content: AppApprovalsState;
};

export type CardTwo = Card & {
  content: DevApprovalsState;
};

export type CardThree = Card & {
  content: CommunityState;
};

export type CardsState = Array<CardOne | CardTwo | CardThree>;

export type CardsStore = {
  cards: CardsState;
  setCards: Dispatch<SetStateAction<CardsState>>;
};

export type DateStore = {
  date: Moment;
  setDate: Dispatch<SetStateAction<Moment>>;
};

export type Context = {
  cardsStore: CardsStore;
  dateStore: DateStore;
};
