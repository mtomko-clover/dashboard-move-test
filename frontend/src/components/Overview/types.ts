import { DocumentNode } from "graphql";

export type Datum = {
  query: DocumentNode;
	title: string;
}

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