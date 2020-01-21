import {gql} from "apollo-boost";


/**
 * Overview/Weekly Digest Queries
 */
export const appsApproved = gql`
	query AppsApproved($start: String, $end: String) {
		appsApproved(start: $start, end: $end) {
			value
			previous
		}
	}
`;

export const appsSubmitted = gql`
	query AppsSubmitted($start: String, $end: String) {
		appsSubmitted(start: $start, end: $end) {
			value
			previous
		}
	}
`;

export const appsRejected = gql`
	query AppsRejected($start: String, $end: String) {
		appsRejected(start: $start, end: $end) {
			value
			previous
		}
	}
`;

export const appsPending = gql`{
	appsPending {
		value
	}
}`;

export const devsApproved = gql`
	query DevsApproved($start: String, $end: String) {
		devsApproved(start: $start, end: $end) {
			value
			previous
		}
	}
`;

export const devsSubmitted = gql`
	query DevsSubmitted($start: String, $end: String) {
		devsSubmitted(start: $start, end: $end) {
			value
			previous
		}
	}
`;

export const devsRejected = gql`
	query DevsRejected($start: String, $end: String) {
		devsRejected(start: $start, end: $end) {
			value
			previous
		}
	}
`;

export const devsPending = gql`{
	devsPending {
		value
	}
}`;

export const communityQuestions = gql`
	query CommunityQuestions($start: String, $end: String) {
		communityQuestions(start: $start, end: $end) {
			value
			previous
		}
	}
`;

export const communityAnswers = gql`
	query CommunityAnswers($start: String, $end: String) {
		communityAnswers(start: $start, end: $end) {
			value
			previous
		}
	}
`;

/**
 * News Queries
 */
export const fetchNewsItems = gql`
	query {
		fetchNewsItems {
			created_at
			id
			author
			title
			description
			link
			type
		}
	}
`;

/**
 * AnnouncementItems Queries
 */
export const fetchAnnouncementItems = gql`
	query {
		announcements {
			created_at
			id
			author
			text
			is_urgent
		}
	}
`;