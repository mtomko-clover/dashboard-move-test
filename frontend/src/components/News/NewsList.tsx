import { List } from "antd";
import { useQuery } from "@apollo/react-hooks";
import React, { ReactElement, ReactNode } from "react";

import Row from "./Row";
import NewsItem from "../../models/NewsItem";
import { news } from "../../utils/queries";


const NewsList = (): ReactElement | null => {
	const { data, error, loading } = useQuery(news);

	if (error) {
		console.error(error);
		return null;
	}

	const newsItem = (item: NewsItem | null): void => {
		console.log("item clicked", item);
		// TO-DO: add view News item
		// const username = CookiesUtil.getCookie(Cookies.USERNAME);

		// if (state.update && (username === state.update.username)) {
		//     setState({ showModal: true, update });
		// } else {
		//     setState({ showViewNews: true, update });
		// }
	};
    // return <>Test</>
	return loading ? null : (
		<List
			className="full-width margin-bottom"
			itemLayout="horizontal"
			dataSource={data.news}
			pagination={{
				onChange: (page): void => console.log(page),
				pageSize: 7,
				position: "bottom",
			}}
			renderItem={(update: NewsItem): ReactNode =>
				update && (
					<List.Item
						className="horizontal-padding"
						onClick={(): void => newsItem(update)}
					>
						<Row update={update} />
					</List.Item>
				)
			}
		/>
	);
};

export default NewsList;
