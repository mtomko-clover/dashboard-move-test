import {Button, Dropdown, Icon, Menu} from "antd";
import {ClickParam} from "antd/es/menu";
import React, {Component} from "react";
import styled from "styled-components";

import './TimeTracker.css';

interface CategoryProps {
    setCategory:(category: any) => any
    categories: any
    label: string
    category?: any
}

interface State {
    category: any
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
  font-size: 18px;
`;

export default class CategoryDropdown extends Component<CategoryProps, any> {

    constructor(props: any) {
        super(props);
        this.categoriesDropdown = this.categoriesDropdown.bind(this);
        this.renderLabel = this.renderLabel.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.state = {
            category: this.props.category !== undefined ?  this.props.category : "Select"
        };
    }


    categoriesDropdown(): React.ReactElement {
        const categories: any = this.props.categories;
        const elements = [];
        for (let category in categories) {
            const menuItem = <Menu.Item key={category} className="dropdown"
                                        onClick={this.setCategory}>{category}</Menu.Item>;
            elements.push(menuItem);
        }
        return <Menu>{elements}</Menu>;
    }


    renderLabel(text: string): React.ReactElement {
        return <FilterLabel>{text}:</FilterLabel>
    }

    setCategory = (e: ClickParam) => {
        const category = e.key;
        this.setState({
            category: category
        });
        this.props.setCategory(category);
    };


    render(): React.ReactNode {
        const categories = this.categoriesDropdown();
        return (
            <FilterDiv>
                {this.renderLabel(this.props.label)}
                <Dropdown className="margin-start" overlay={categories}>
                    <Button size="large">
                        {this.state.category} <Icon type="down"/>
                    </Button>
                </Dropdown>
            </FilterDiv>
        )
    }
}

