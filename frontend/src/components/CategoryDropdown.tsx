import {Button, Dropdown, Icon, Menu} from "antd";
import {ClickParam} from "antd/es/menu";
import React, {ReactElement, useState} from "react";
import styled from "styled-components";

// import {NEWS_CATEGORIES} from "../models/NewsCategories"

// import './TimeTracking/TimeTracker.css';

interface CategoryProps {
    setCategory?: (category: any) => any;
    categories: any;
    label: string;
    category?: any;
}

interface State {
    category: any;
}


const FilterDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;  
  margin-right: 50px;
`;

const FilterLabel = styled.label`
  white-space: nowrap;
  margin-right: 10px;
  font-size: 16px;
`;

const CategoryDropdown = ({ category, categories, label }: CategoryProps): ReactElement => {
    const initialState: State = {
        category: category ? category : "Select"
    };
    const [state, setState] = useState(initialState);

    const categoriesList: Array<string> = Object.values(categories);
    const menu = (): ReactElement => (
        <Menu>
            {categoriesList.map((cat: string) => 
                <Menu.Item key={cat} className="dropdown" onClick={setCategory}>{cat}</Menu.Item>
            )}
        </Menu>
    )

    const setCategory = (e: ClickParam): void => {
        const category = e.key;
        setState({ category });
    };

    return (
        <FilterDiv>
            <FilterLabel>{label}:</FilterLabel>
            <Dropdown className="margin-start" overlay={menu}>
                <Button size="default">
                    {state.category} <Icon type="down"/>
                </Button>
            </Dropdown>
        </FilterDiv>
    )
}

export default CategoryDropdown;
