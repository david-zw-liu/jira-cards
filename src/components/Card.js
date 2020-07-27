import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  position: relative;
  margin-bottom: 1cm;
  height: calc(50vh - 1cm);
  box-sizing: border-box;
  flex: 0 0 50%;
  border-left: 0.3cm solid black;
  padding: 0 16px;
  
  h3 {
    font-size: 18px;
    font-weight: normal;
  }
  
  h2 {
    height: 24px;
  }
  
  span.assignee {
    display: inline-block;
    position: absolute;
    right: 20px;
    bottom: 10px;
  }
`

const Card = (props) => {
  const { title, taskId, storyPoints, assignee } = props;

  return (
    <CardContainer className="card">
      <h3>{taskId}</h3>
      <h2>({storyPoints || ' '}) {title}</h2>

      <span className="assignee">{assignee}</span>
    </CardContainer>
  )
};
export default Card;
