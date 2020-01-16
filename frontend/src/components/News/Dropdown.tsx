import {Button, Dropdown, Icon, Menu} from "antd";
import {ClickParam} from "antd/es/menu";
import React, {ReactElement, useContext} from "react";
import styled from "styled-components";

import {NewsContext} from "./store";

interface CategoryProps {
    setCategory?: (category: any) => any;
    categories: any;
    label: string;
}

interface State {
    category: any;
}

const FilterDiv = styled.div`
    display: flex;
    flex-direction: row;
    width: 100px;

    button.ant-btn {
		display: flex;
        width: 100%;
    }

    i.anticon-down {
		margin-top: 2px;
    }
`;

const Category = styled.div`
	width: 75%;
    font-family: "Maison Mono";
    font-size: 14px;
    margin: 0;
`;

const CategoryDropdown = ({ categories, label }: CategoryProps): ReactElement => {
	const { dropdown: { category, setCategory }} = useContext(NewsContext);

    const categoriesList: Array<string> = Object.values(categories);
    const menu = (): ReactElement => (
        <Menu>
            {categoriesList.map((cat: string) => 
                <Menu.Item key={cat} className="dropdown" onClick={({ key }: ClickParam): void => setCategory(key)}>{cat}</Menu.Item>
            )}
        </Menu>
    )

    return (
        <FilterDiv>
            <Dropdown className="margin-start" overlay={menu}>
                <Button size="default">
                    <Category>{category}</Category>
                    <Icon type="down"/>
                </Button>
            </Dropdown>
        </FilterDiv>
    )
}

export default CategoryDropdown;
