import { useQuery } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import moment, { Moment } from 'moment';
import React, { ReactElement } from 'react';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';

import { CardContainer, CardTitle, Datum, Stat, StatTitle, StatDatum } from './Card.styles';

TweenOne.plugins.push(Children);

interface CardProps {
  date: Moment;
  key: number | string;
  query: DocumentNode;
  title: string;
}

const Card = ({ date, query, title }: CardProps): ReactElement | null => {
  const dateF = 'YYYY-MM-DD';
  const start = moment(date)
    .startOf('week')
    .format(dateF);
  const end = moment(date)
    .endOf('week')
    .format(dateF);
  const { data, error } = useQuery(query, { variables: { start, end } });

  if (error) return null;

  const value = data && Object.keys(data).length ? data[Object.keys(data)[0]].value : 0;
  const previous = data && Object.keys(data).length ? data[Object.keys(data)[0]].previous : null;

  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <Datum>
        <TweenOne animation={{ Children: { value, floatLength: 0 } }}>{0}</TweenOne>
      </Datum>
      <Stat>
        {typeof previous === 'number' && <StatTitle>prior week</StatTitle>}
        <StatDatum>{previous}</StatDatum>
      </Stat>
    </CardContainer>
  );
};

export default Card;
