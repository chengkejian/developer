import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import {
  Paper,
  TableCell, TableRow, Table,
} from '@material-ui/core';


import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
      },
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: 'caption', paragraph: true },
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    table: {
      // eslint-disable-next-line react/prop-types
      component: ({ children }) => (
        <Paper>
          <Table>
            {children}
          </Table>
        </Paper>

      ),
    },
    pre: {
      // eslint-disable-next-line react/prop-types
      component: ({ children }) => (
        <Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {children}
          </pre>
        </Typography>

      ),
    },
    tr: { component: TableRow },
    td: { component: TableCell },
    th: { component: TableCell },
    li: {
      component: withStyles(styles)(({ classes, children }) => (
        <li className={classes.listItem}>
          <Typography component="span">{children}</Typography>
        </li>
      )),
    },
  },
};

export default function Markdown(props) {
  return <ReactMarkdown options={options} {...props} />;
}
