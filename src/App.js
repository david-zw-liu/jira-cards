import React, { useState, useEffect } from 'react';
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
  }

  .no-print {
    display: block;

    @media print {
      display: none !important;
    }
  }

  .print {
    display: none;

    @media print {
      display: block !important;
    }
  }
`;

function App() {
  const [xml, setXml] = useState('');
  const [tmpCard, setTmpCard] = useState([]);

  useEffect(() => {
    try {
      const { rss } = parser.parse(xml, {
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
        tagValueProcessor : (val, tagName) => he.decode(val),
      });
      const items = rss?.channel?.item || [];
      setTmpCard(items.map(item => {
        const customFields = item.customfields?.customfield || [];
        const storyPointsField = customFields.find(f => f.customfieldname === 'Story point estimate');
        const storyPoints = storyPointsField?.customfieldvalues?.customfieldvalue;
        const title = (item?.title || '').toString().match(/(\[.*\] )*(.+)/)?.[2];
  
        return {
          title,
          storyPoints,
          taskId: item.key,
          assignee: item.assignee,
          checked: true,
        };
      }));
    } catch (e) {
      console.error(e);
    }
  }, [xml]);

  const handleCheck = (taskId) => {
    setTmpCard((prevTmpCard) => (
      prevTmpCard.map((cardInfo) => {
        return cardInfo.taskId !== taskId
          ? cardInfo
          : { ...cardInfo, checked: !cardInfo.checked };
      })
    ));
  };

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
      <Container>
        {tmpCard.map(cardInfo => (
          <Card
            key={cardInfo.taskId}
            handleCheck={handleCheck}
            className="no-print"
            {...cardInfo}
          />))}
      </Container>
      <Container>
        {tmpCard.filter(({ checked }) => checked).map(cardInfo => (
          <Card
            key={cardInfo.taskId}
            handleCheck={handleCheck}
            className="print"
            {...cardInfo}
          />))}
      </Container>
    </Container>
  );
}

export default App;
