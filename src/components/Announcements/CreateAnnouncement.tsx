import { Modal, notification, Checkbox } from "antd";
import React, { ChangeEvent, ReactElement, useContext } from "react";
import {
	CreateAnnouncementExclamationIcon,
	EditRow,
	EditInput,
} from "./Announcement.styles";
import { fetchAnnouncementItems } from "../../utils/queries";
import { gql } from "apollo-boost";
import { AnnouncementContext } from "./store";
import { useMutation } from "@apollo/react-hooks";
import { CookiesUtil } from "../../utils/CookiesUtil";
import { Cookies } from "../../utils/Cookies";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const CreateAnnouncement = (): ReactElement => {
	const {
		form: { text, isUrgent, setFormState },
		modal: { visible, toggleModal },
	} = useContext(AnnouncementContext);

	const mutation = gql`
		mutation CreateAnnouncement(
			$text: String
			$is_urgent: Boolean
			$username: String
		) {
			createAnnouncement(
				text: $text
				is_urgent: $is_urgent
				username: $username
			) {
				message
			}
		}
	`;

	const options = {
		refetchQueries: [{ query: fetchAnnouncementItems }],
	};
	const [createAnnouncement] = useMutation(mutation, options);

	const handleInputChange = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
	): void => {
		e.persist();
		setFormState(prevState => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const handleisUrgentChange = (e: CheckboxChangeEvent): void => {
		setFormState(prevState => ({
			...prevState,
			isUrgent: e.target.checked,
		}));
	};

	const addAnnouncement = (): void => {
		if (text.length) {
			const username = CookiesUtil.getCookie(Cookies.USERNAME);
			createAnnouncement({
				variables: { text, is_urgent: true, username },
			});
			toggleModal({ visible: !visible });
		} else {
			notification.open({
				message: "Error",
				description: "Please add text to your announcement",
				icon: <i className="fas fa-exclamation-triangle" />,
				placement: "topLeft",
			});
		}
	};

	return (
		<Modal
			className="news_update"
			title="Create Announcement"
			visible={visible}
			onOk={addAnnouncement}
			okText="Save"
			onCancel={(): void => toggleModal({ visible: !visible })}
			afterClose={(): void => toggleModal({ visible: !visible })}
			destroyOnClose={true}
		>
			<EditRow>
				<Checkbox
					className="margin-after"
					checked={isUrgent}
					onChange={handleisUrgentChange}
				>
					<CreateAnnouncementExclamationIcon className="fas fa-exclamation" />
					Urgent
				</Checkbox>
				<EditInput
					type="text"
					placeholder="Announcement"
					name="text"
					value={text}
					onChange={handleInputChange}
				/>
			</EditRow>
		</Modal>
	);
};

export default CreateAnnouncement;
