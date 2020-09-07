import React, { useState } from 'react';
import styled from 'styled-components';
import parser from 'fast-xml-parser';
import he from 'he';

import Card from './components/Card';

const transformItem = item => {
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
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  
  .no-print {
    @media print {    
      display: none !important;
    }
  }

  .input-block {
    padding: 16px;

    textarea {
      width: 100%;
    }
  }
`;

function App() {
  const [xml, setXml] = useState('');
  const [cardInfos, setCardInfos] = useState([]);
  const onSubmit = () => {
    try {
      const { rss } = parser.parse(xml, {
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),
        tagValueProcessor : (val, tagName) => he.decode(val),
      });
      const items = rss?.channel?.item || [];
  
      if (Array.isArray(items)) {
        setCardInfos(oldItems => [...items.map(transformItem), ...oldItems]);
      } else {
        setCardInfos(oldItems => [transformItem(items), ...oldItems]);
      }
      setXml('');
    } catch (e) {
      console.error(e);
    }
  }
  const removeCard = (cardInfo) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('確定要移除嗎？')) return;

    setCardInfos(oldItems => oldItems.filter(item => item !== cardInfo));
  }


  return (
    <Container>
      <div className="input-block no-print" style={{ width: '100%', marginBottom: '16px', textAlign: 'right' }}>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={xml}
          onChange={(e) => setXml(e.currentTarget.value)}
        />
        <button onClick={onSubmit}>送出</button>
      </div>

      {cardInfos.map(cardInfo => (<Card key={cardInfo.taskId} {...cardInfo} onClick={() => removeCard(cardInfo)} />))}
    </Container>
  );
}

export default App;
