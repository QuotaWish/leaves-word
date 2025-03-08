import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '科塔锐行团队';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'codeNav',
          title: 'QuotaWish',
          href: 'https://quotawish.com',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: '科塔锐行',
          href: 'https://quotawish.com',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> LeavesWord
            </>
          ),
          href: 'https://github.com/LeavesWord',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
