import React from 'react';
import { useState, useCallback } from 'react';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';
import CardContent from '@material-ui/core/CardContent';
import './index.css';

const rawTest = ` `;

function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
      node.innerText = rawTest;
    }
  }, []);

  return (
    <>
      <h1 style={{ width: '30px' }} ref={measuredRef}>
Hello, world
        {rawTest}
      </h1>
      <h2 style={{display: 'none'}}>
        {Math.round(height)}
      </h2>
    </>
  );
}

const Example = (props) => (
  <div className="container">
    <Card align="center" style={{ margin: '5px' }}>
      <CardContent>
        <Link component={RouterLink} to="/i">
      主页
        </Link>
      </CardContent>
    </Card>
  <MeasureExample />
  </div>
)
  /* const data = useFetch("/api/resource", props.history);
  if(data.data !== undefined) {
    return (
      <div>
        <Link to="/i">主页</Link>
        <ul>
          {data.data.list.map(el => (
            <li key={el.id}>
              {el.title}
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <Link to="/i">主页</Link>
      </div>
    )
  } */
;

export default withRouter(Example);
