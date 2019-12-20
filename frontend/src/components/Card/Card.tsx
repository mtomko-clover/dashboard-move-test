import {Icon} from "antd";
import React from "react";

import {
    CardContainer,
    CardTitle,
    Datum,
    Stat,
    StatTitle,
    StatDatum
} from "./Card.styles";


interface DisplayProps {
    title: string;
    datum: number;
    stat?: {
        title: string;
        type: string;
        datum: number;
    }
}

const Card = ({ datum, stat, title }: DisplayProps) => {
const renderDatum = (stat: any) => <>
    {stat && stat.type === "percentageUp" ? <Icon type="caret-up" /> : <Icon type="caret-down" />}
    <StatDatum>
        {stat && stat.datum}
    </StatDatum>
</>; 

    return (
        <CardContainer>
            <CardTitle>{title}</CardTitle>
            <Datum>{datum}</Datum>
            <Stat>
                <StatTitle>
                    from last week
                </StatTitle>
                {renderDatum(stat)}
            </Stat>
        </CardContainer>
    )
}

export default Card;