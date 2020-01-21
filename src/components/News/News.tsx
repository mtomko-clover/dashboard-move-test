import React, { ReactElement, useContext } from "react";

import { BigCard } from "../BigCard";
import CreateNewsItem from "./CreateNewsItem";
import NewsList from "./NewsList";
import { NewsContext } from "./store";
import { Date, Heading, Title, Type } from "./News.styles";

const News = (): ReactElement | null => {
	const { modal: { toggleModal, visible } } = useContext(NewsContext);

	const addNewsItem = (
		<div onClick={(): void => toggleModal({ visible: !visible })}>
			<i className="fas fa-plus margin-after" />
		</div>
	);
	return (
		<BigCard title="News" headerChild={addNewsItem}>
			{visible && <CreateNewsItem />}
			<Heading>
				<Date>Date</Date>
				<Title>Title</Title>
				<Type>Type</Type>
			</Heading>
			<NewsList />
		</BigCard>
	);
};

export default News;
