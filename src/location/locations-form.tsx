import * as L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import * as React from 'react';
import {Map as LeafletMap, Marker, Popup, TileLayer} from 'react-leaflet';
import { SearchComponent, SearchState } from 'react-hook-core';
import PageSizeSelect from 'react-page-size-select';
import Pagination from 'reactx-pagination';
import { getLocale, message, storage, showAlert } from 'uione';
import applicationContext from '../config/ApplicationContext';
import { RouteComponentProps } from 'react-router';
import { Location, LocationFilter } from './service/location/location';

// import {w3cwebsocket as W3CWebSocket} from 'websocket';

// const client = new W3CWebSocket('ws://localhost:8000');
interface InternalState extends SearchState<Location, LocationFilter> {
  keyword: string;
  results: any[];
  locationName: string;
  isDisable: boolean;
  markers: any[]
}
export class LocationsForm extends SearchComponent<Location, LocationFilter, RouteComponentProps, InternalState> {
  constructor(props: any) {
    super(props, applicationContext.getLocationService(), storage.resource(), message, showAlert, getLocale, storage.ui(),storage.loading(),'');
    this.state = {
      keyword: '',
      results: [],
      locationName: '',
      isDisable: true,
      markers: []
    };
  }
  currentUserId = '';
  componentDidMount() {
    const defaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = defaultIcon;
    const user = storage.user();
    this.currentUserId = user && user.username || '';
    // client.onopen = () => {
    //   console.log('WebSocket Client Connected');
    //   const obj = {
    //     userId: this.currentUserId
    //   };
    //   client.send(JSON.stringify(obj));
    // };
    // client.onmessage = (message) => {
    //   alert(message.data);
    // };
    // window.addEventListener('beforeunload', (ev) => {
    //   ev.preventDefault();
    //   const obj = {
    //     userId: this.currentUserId
    //   };
    //   client.send(JSON.stringify(obj));
    // });
    super.componentDidMount();

  }

  viewDetail = (e: any, id: string) => {
    e.preventDefault();
    this.props.history.push(`location/${id}`);
  }
  protected clearUserId = () => {
    this.setState({
      locationName: ''
    });
  }
  switch = () => {
    this.setState({ isDisable: !this.state.isDisable });
  }
  addMarker = (results: any) => {
    const markerNews: any = [];
    results.map((item: any) => {
      const obj = {
        lat: item.latitude,
        lng: item.longitude
      };
      markerNews.push(obj);
    });
    this.setState({ markers: markerNews });
  }
  render() {
    const resource = this.resource;
    const { results, markers } = this.state;
    console.log('results', results);
    if (results.length > 0 && markers.length === 0) {
      this.addMarker(results);
    }
    return (
      <div className='view-container'>
        <header>
          <h2>{resource.user_list}</h2>
          {this.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={this.add} />}
        </header>
        <div>
          <form id='locationsForm' name='locationsForm' noValidate={true} ref='form'>
            <section className='row search-group'>
              <label className='col s12 m6 search-input'>
                <PageSizeSelect size={this.pageSize} sizes={this.pageSizes} onChange={this.pageSizeChanged} />
                <input type='text' id='keyword' name='keyword' value={this.state.keyword} onChange={this.updateState} maxLength={1000} placeholder={resource.keyword} />
                <button type='button' hidden={this.state.keyword === ''} className='btn-remove-text'
                // onClick={this.clearKeyword}
                />
                <button type='submit' className='btn-search'
                // onClick={this.searchOnClick} 
                />
              </label>
              <Pagination className='col s12 m6' total={this.total} size={this.pageSize} max={this.pageMaxSize} page={this.pageIndex} onChange={this.pageChanged} init={this.initPageSize} />
            </section>
          </form>
          <div className='col s12 m6 l4' >
            <button id='btnList' name='btnList' disabled={this.state.isDisable} onClick={() => this.switch()}>ShowList</button>
            <button id='btnMap' name='btnMap' disabled={!this.state.isDisable} onClick={() => this.switch()}>ShowMap</button>
          </div>
          {
            (this.state.isDisable === true) ?
              <form className='list-result'>
                <ul className='row list-view'>
                  {this.state && this.state.results && this.state.results.map((location, i) => {
                    return (
                      <li key={i} className='col s12 m6 l4 xl3' onClick={(e) => this.viewDetail(e, location.locationId)}>
                        <section>
                          {/*<img src={maleIcon} className='round-border'/>*/}
                          <div>
                            <h3>{location.locationName}</h3>
                            <p>{location.description}</p>
                          </div>
                          <button id={'btnView' + i} className='btn-detail' />
                        </section>
                      </li>
                    );
                  })}
                </ul>
              </form>
              : <div style={{ height: '90%', width: '100%' }}>
                <LeafletMap
                  center={{ lat: 10.854886268472459, lng: 106.63051128387453 }}
                  zoom={16}
                  maxZoom={20}
                  attributionControl={true}
                  zoomControl={true}
                  scrollWheelZoom={true}
                  dragging={true}
                  animate={true}
                  easeLinearity={0.35}
                  style={{ height: '100%' }}
                >
                  <TileLayer

                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  />
                  {this.state.markers.map((position, idx) =>
                    <Marker key={`marker-${idx}`} position={position}>
                      <Popup>
                        <span>{results[idx]['locationName']}</span>
                      </Popup>
                    </Marker>
                  )}
                </LeafletMap>
              </div>
          }
        </div>
      </div>
    );
  }
}
