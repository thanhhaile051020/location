import { Filter, ValueText } from 'onecore';
import * as React from 'react';
import { checked, SearchComponentState, useSearch, value } from 'react-hook-core';
import { PageSizeSelect } from 'react-page-size-select';
import { useHistory } from 'react-router-dom';
import { Pagination } from 'reactx-pagination';
import { inputSearch } from 'uione';
import femaleIcon from '../assets/images/female.png';
import maleIcon from '../assets/images/male.png';
import { Cinema, useCinema } from './service';

interface CinemaSearch extends SearchComponentState<Cinema, CimemaFilter> {
  statusList: ValueText[];
}

export interface CimemaFilter extends Filter {
  id: string;
  name: string;
  status: string;
}

const cimemasFilter = {
  id: '',
  name: '',
  status: ''
};

const initialState: CinemaSearch = {
  statusList: [],
  list: [],
  filter: cimemasFilter
};
export const CinemasForm = () => {
  const refForm = React.useRef();
  const history = useHistory();
  const { state, resource, component, updateState, add, search, sort, toggleFilter, changeView, pageChanged, pageSizeChanged } = useSearch<Cinema, CimemaFilter, CinemaSearch>(refForm, initialState, useCinema(), inputSearch());
  component.viewable = true;
  component.editable = true;

  const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    history.push(`cinemas/edit/${id}`);
  };

  const { list } = state;
  const filter = value(state.filter);
  return (
    <div className='view-container'>
      <header>
        <h2>{resource.id}</h2>
        <div className='btn-group'>
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
          {component.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={add} />}
        </div>
      </header>
      <div>
        <form id='cinemasForm' name='cinemasForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group'>
            <label className='col s12 m4 search-input'>
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
              <input type='text' id='q' name='q' value={filter.q} onChange={updateState} maxLength={255} placeholder={resource.keyword} />
              <button type='button' className='btn-filter' onClick={toggleFilter} />
              <button type='submit' className='btn-search' onClick={search} />
            </label>
            <Pagination className='col s12 m8' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
          </section>
          <section className='row search-group inline' hidden={component.hideFilter}>
            <label className='col s12 m4 l4'>
              {resource.name}
              <input type='text'
                id='name' name='name'
                value={filter.name}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.name} />
            </label>
            {/* <label className='col s12 m4 l4'>
              {resource.name}
              <input type='text'
                id='displayName' name='displayName'
                value={filter.name}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.name} />
            </label> */}
            <label className='col s12 m4 l4 checkbox-section'>
              {resource.status}
              <section className='checkbox-group'>
                <label>
                  <input
                    type='checkbox'
                    id='A'
                    name='status'
                    value='A'
                    checked={checked(filter.status, 'A')}
                    onChange={updateState} />
                  {resource.active}
                </label>
                <label>
                  <input
                    type='checkbox'
                    id='I'
                    name='status'
                    value='I'
                    checked={checked(filter.status, 'I')}
                    onChange={updateState} />
                  {resource.inactive}
                </label>
              </section>
            </label>
          </section>
        </form>
        <form className='list-result'>
          {component.view === 'table' && <div className='table-responsive'>
            <table>
              <thead>
                <tr>
                  <th>{resource.sequence}</th>
                  <th data-field='id'><button type='button' id='sortCinemaId' onClick={sort}>{resource.id}</button></th>
                  <th data-field='name'><button type='button' id='sortCinemaName' onClick={sort}>{resource.name}</button></th>
                  {/* <th data-field='email'><button type='button' id='sortEmail' onClick={sort}>{resource.email}</button></th>
                  <th data-field='displayname'><button type='button' id='sortDisplayName' onClick={sort}>{resource.display_name}</button></th> */}
                  <th data-field='status'><button type='button' id='sortStatus' onClick={sort}>{resource.status}</button></th>
                </tr>
              </thead>
              {list && list.length > 0 && list.map((cinema, i) => {
                return (
                  <tr key={i} onClick={e => edit(e, cinema.id)}>
                    <td className='text-right'>{(cinema as any).sequenceNo}</td>
                    <td>{cinema.name}</td>
                    <td>{cinema.status}</td>
                    {/* <td>{cinema.name}</td>
                    <td>{cinema.email}</td>
                    <td>{cinema.displayName}</td>
                    <td>{cinema.status}</td> */}
                  </tr>
                );
              })}
            </table>
          </div>}
          {component.view !== 'table' && <ul className='row list-view'>
            {list && list.length > 0 && list.map((cinema, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, cinema.id)}>
                  <section>
                    {/* <img src={cinema.imageURL && cinema.imageURL.length > 0 ? cinema.imageURL : (cinema.gender === 'F' ? femaleIcon : maleIcon)} className='round-border' /> */}
                    <div>
                      <h3 className={cinema.status === 'I' ? 'inactive' : ''}>{cinema.name}</h3>
                      <p>{cinema.id}</p>
                    </div>
                    <button className='btn-detail' />
                  </section>
                </li>
              );
            })}
          </ul>}
        </form>
      </div>
    </div>
  );
};
