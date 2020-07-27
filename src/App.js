import React, { useState } from 'react';
import styled from 'styled-components';
import parser from 'fast-xml-parser';
import he from 'he';

import Card from './components/Card';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  
  textarea {
    width: 100%;
    margin-bottom: 30px;
    
    @media print {    
      display: none !important;
    }
`;

function App() {
  const [xml, setXml] = useState('');
  let cardInfos = [];
  try {
    const { rss } = parser.parse(xml, {
      attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
      tagValueProcessor : (val, tagName) => he.decode(val),
    });
    const items = rss?.channel?.item || [];
    cardInfos = items.map(item => {
      const customFields = item.customfields?.customfield || [];
      const storyPointsField = customFields.find(f => f.customfieldname === 'Story point estimate');
      const storyPoints = storyPointsField?.customfieldvalues?.customfieldvalue;
      const title = (item?.title || '').toString().match(/(\[.*\] )*(.+)/)?.[2];

      return {
        title,
        storyPoints,
        taskId: item.key,
        assignee: item.assignee,
      };
    });
  } catch (e) {
    console.error(e);
  }

  return (
    <Container>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        value={xml}
        onChange={(e) => setXml(e.currentTarget.value)}
      />

      {cardInfos.map(cardInfo => (<Card key={cardInfo.taskId} {...cardInfo}/>))}
    </Container>
  );
}

export default App;
