import * as React from 'react';
import { Link } from 'react-router-dom';

export interface StringMap {
  [key: string]: string;
}
export interface Privilege {
  id?: string;
  name: string;
  resource?: string;
  path?: string;
  icon?: string;
  sequence?: number;
  children?: Privilege[];
}
export type Pin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, id: Privilege) => void;
export const renderItems = (activePath: string, features: Privilege[], pin: Pin, resource?: StringMap, pinable?: boolean, isPinned?: boolean) => {
  return features.map((feature, index) => {
    return renderItem(activePath, index, feature, pin, resource, pinable, isPinned);
  });
};
export const renderItem = (activePath: string, key: number, module: Privilege, pin: Pin, resource?: StringMap, pinable?: boolean, isPinned?: boolean) => {
  let name = module.name;
  if (resource && module.resource) {
    name = !resource[module.resource] || resource[module.resource] === '' ? module.name : resource[module.resource];
  }
  const className = getIconClass(module.icon);
  if (module.children && Array.isArray(module.children)) {
    const link = module.path;
    const features = module.children;
    return (
      <li key={key} className={'open ' + activeWithPath(activePath, link, true, features)} /* onBlur={this.menuItemOnBlur} */>
        <a className='menu-item' onClick={(e) => toggleMenuItem(e)}>
        {pinable && <button type='button' className={`btn-pin ${isPinned ? 'pinned' : ''}`} onClick={(event) => pin(event, key, module)} />}
          <i className='material-icons'>{className}</i>
          <span>{name}</span>
          <i className='entity-icon down' />
        </a>
        <ul className='list-child'>{renderItems(activePath, features, pin, resource, false)}</ul>
      </li>
    );
  } else {
    return (
      <li key={key} className={activeWithPath(activePath, module.path, false)}>
        <Link to={module.path as any}>
          {pinable && <button type='button' className={`btn-pin ${isPinned ? 'pinned' : ''}`} onClick={(event) => pin(event, key, module)} />}
          <i className='material-icons'>{className}</i>
          <span>{name}</span>
        </Link>
      </li>
    );
  }
};
export function findParent(ele: HTMLElement, node: string): HTMLElement|null {
  let current: HTMLElement|null = ele;
  while (true) {
    current = current.parentElement;
    if (!current) {
      return null;
    }
    if (current.nodeName === node) {
      return current;
    }
  }
}
export function getIconClass(icon?: string): string {
  return !icon || icon === '' ? 'settings' : icon;
}
export const onMouseHover = (e: { preventDefault: () => void; }, sysBody: HTMLElement) => {
  e.preventDefault();
  if (sysBody.classList.contains('top-menu') && window.innerWidth > 768) {
    const navbar = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>ul.expanded'));
    const icons = Array.from(document.querySelectorAll('.sidebar>nav>ul>li>a>i.up'));
    if (navbar.length > 0) {
      for (let i = 0; i < navbar.length; i++) {
        navbar[i].classList.toggle('expanded');
        if (icons[i]) {
          icons[i].className = 'entity-icon down';
        }
      }
    }
  }
};
export const hideAll = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  e.preventDefault();
  const parent = findParent(e.currentTarget, 'NAV');
  if (parent) {
    const navbar = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>ul.expanded'));
    const icons = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>a>i.up'));
    if (navbar.length > 0) {
      let i = 0;
      for (i = 0; i < navbar.length; i++) {
        navbar[i].className = 'list-child';
        if (icons[i]) {
          icons[i].className = 'entity-icon down';
        }
      }
    }
  }
};
export const showAll = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  e.preventDefault();
  const parent = findParent(e.currentTarget, 'NAV');
  if (parent) {
    const navbar = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>ul.list-child'));
    const icons = Array.from(parent.querySelectorAll('.sidebar>nav>ul>li>a>i.down'));
    if (navbar.length > 0) {
      let i = 0;
      for (i = 0; i < navbar.length; i++) {
        navbar[i].className = 'list-child expanded';
        if (icons[i]) {
          icons[i].className = 'entity-icon up';
        }
      }
    }
  }
};
export const activeWithPath = (activePath: string, path: string | undefined, isParent: boolean, features?: Privilege[]) => {
  if (isParent && features && Array.isArray(features)) {
    const hasChildLink = features.some((item) => activePath.startsWith(item['link']));
    return path && activePath.startsWith(path) && hasChildLink ? 'active' : '';
  }
  return path && activePath.startsWith(path) ? 'active' : '';
};
export const toggleMenuItem = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
  event.preventDefault();
  let target: HTMLElement|null = event.currentTarget;
  const currentTarget = event.currentTarget;
  const elI = currentTarget.querySelectorAll('.menu-item > i')[1];
  if (elI) {
    if (elI.classList.contains('down')) {
      elI.classList.remove('down');
      elI.classList.add('up');
    } else {
      if (elI.classList.contains('up')) {
        elI.classList.remove('up');
        elI.classList.add('down');
      }
    }
  }
  if (currentTarget.nextElementSibling) {
    currentTarget.nextElementSibling.classList.toggle('expanded');
  }
  if (target.nodeName === 'A') {
    target = target.parentElement;
  }
  if (target && target.nodeName === 'LI') {
    target.classList.toggle('open');
  }
};
