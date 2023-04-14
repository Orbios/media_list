import {Link} from 'react-router-dom';
import {MdLocalMovies} from 'react-icons/md';
import {TbBooks} from 'react-icons/tb';
import {ImDownload3} from 'react-icons/im';
import {IoSettingsSharp} from 'react-icons/io5';
import {SlGameController} from 'react-icons/sl';

import Tooltip from '@/components/common/Tooltip';

import * as styled from './Navigation.styled';

interface CustomLink {
  url: string;
  icon: any;
  tooltip: string;
}

const links: CustomLink[] = [
  {url: '/', icon: <MdLocalMovies />, tooltip: 'Movies'},
  {url: '/books', icon: <TbBooks />, tooltip: 'Books'},
  {url: '/games', icon: <SlGameController />, tooltip: 'Games'},
  {url: '/import', icon: <ImDownload3 />, tooltip: 'Import'},
  {url: '/preferences', icon: <IoSettingsSharp />, tooltip: 'Preferences'}
];

function Navigation() {
  return (
    <styled.wrapper>
      <styled.container>
        {links.map(link => {
          const url = link.url;

          return (
            <styled.item key={url}>
              <Link to={url}>
                <styled.action variant="link" className="nav">
                  <Tooltip id={`nav-${link.icon}`} title={link.tooltip} placement="right">
                    {link.icon}
                  </Tooltip>
                </styled.action>
              </Link>
            </styled.item>
          );
        })}
      </styled.container>
    </styled.wrapper>
  );
}

export default Navigation;
