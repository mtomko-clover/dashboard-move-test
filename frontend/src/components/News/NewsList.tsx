import {List} from "antd";
import {useQuery} from "@apollo/react-hooks";
import React, {ReactElement, ReactNode} from "react";

import Row from "./Row";
import NewsItem from "../../models/NewsItem";
import {fetchNewsItems} from "../../utils/queries";

const NewsList = (): ReactElement | null => {
	const { data, error, loading } = useQuery(fetchNewsItems, {});

	if (error) {
		console.error(error);
		return null
	}

    const updateClicked = (update: NewsItem | null): void => {
		console.log("update clicked", update);
		// TO-DO: add view News item
        // const username = CookiesUtil.getCookie(Cookies.USERNAME);

        // if (state.update && (username === state.update.username)) {
        //     setState({ showModal: true, update });
        // } else {
        //     setState({ showViewNews: true, update });
        // }
    }

	return loading ? null : (
		<List
			className="full-width margin-bottom"
			itemLayout="horizontal"
			dataSource={data.fetchNewsItems}
			pagination={{
				onChange: (page): void => console.log(page),
				pageSize: 7,
				position: "bottom"
			}}
			renderItem={(update: NewsItem): ReactNode => update && (
				<List.Item className="horizontal-padding" onClick={(): void => updateClicked(update)}>
					<Row update={update}/>
				</List.Item>
			)}
		/>
	)
}

export default NewsList;
