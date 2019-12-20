import React, {Component} from "react";
import styled from "styled-components";

// import PieChart from "./PieChart";


interface DisplayProps {
    title: string;
    subtitle?: string;
    number: number;
}

const DisplayContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 5px;
    align-items: center;
    margin: 10px 30px;
    background: white;
    box-shadow: ${({ theme }) => theme.boxShadow}
`;

const Title = styled.div`
    padding: 10px;
    font-size: 20px;
    font-style: bold;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const Subtitle = styled.div`
    font-size: 15px;
    font-style: bold;
    text-align: center;
`;

const Number = styled.div`
    font-size: 70px;
    padding: 0px 30px;
`;

export default class DisplayNumber extends Component<DisplayProps, any> {

    // constructor(props: any) {
    //     super(props);
    // }

    render(): React.ReactNode {
        return (
            <DisplayContainer>
                <Title>
                    {this.props.title}
                    <Subtitle>{this.props.subtitle}</Subtitle>
                </Title>
                <Number>{this.props.number}</Number>
            </DisplayContainer>
        )
    }
}
