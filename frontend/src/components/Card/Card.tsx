import {Icon} from "antd";
import React, {ReactElement} from "react";

import {
    CardContainer,
    CardTitle,
    Datum,
    Stat,
    StatTitle,
    StatDatum
} from "./Card.styles";


type Stat = {
    title: string;
    type: string;
    datum: number;
}

interface DisplayProps {
    title: string;
    datum: number | null;
    stat?: Stat;
}

const Card = ({ datum, stat, title }: DisplayProps): ReactElement => {
    const renderDatum = (stat?: Stat): ReactElement => <>
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