import React from 'react';
import Exception, { IExceptionProps } from 'ant-design-pro/lib/Exception';
import LinkButton from 'components/LinkButton';

const actions = (
  <div>
    <LinkButton type="primary" to="/proposals">
      Explore projects
    </LinkButton>
    <LinkButton type="default" to="/create">
      Create project
    </LinkButton>
  </div>
);

const content: { [index: string]: IExceptionProps } = {
  404: {
    title: '404',
    desc: 'Sorry, we could not find the page you were looking for.',
    actions,
    style: { padding: '2rem' },
  },
};

interface Props {
  code: '403' | '404' | '500';
}

const ExceptionComponent: React.SFC<Props> = ({ code }) => (
  <Exception type={code} {...content[code]} />
);

export default ExceptionComponent;
