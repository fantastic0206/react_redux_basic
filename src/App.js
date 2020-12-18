import './App.css';
import { connect } from 'react-redux';
import * as actions from './actions';
import Child from './child/Child';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super();
    this.onSearchFiltering = this.onSearchFiltering.bind(this);
    this.onMenuClicked = this.onMenuClicked.bind(this);
    this.onChangePagenation = this.onChangePagenation.bind(this);
    this.state = {
      menuList: ["Channels", "Optimization", "Reporting", "Dialer", "Voice Analytics"],
      childList: [],
    }
  }

  componentDidMount() {
    this.props.fetchAllData(); // when enter the first page, all apps is displayed.
  }

  onChangePagenation(e) { // when pageNate changed, it occurs
    if (this.props.page_num === Math.ceil(this.props.childList.length / 3) && e === "right") return; //return when page number is last and click right arrow button
    if (this.props.page_num === 1 && e === "left") return; // return when page number is first and click left arrow button
    if (this.props.page_num === 0 && e === "left") return; //return when enter the first and click left arrow button
    if (e === "right") this.props.setPageNum(this.props.page_num + 1);
    else if (e === "left") this.props.setPageNum(this.props.page_num - 1)
    else this.props.setPageNum(e);
  }
  onSearchFiltering(e) { //when filter apps by input data
    let fil_val = e.target.value;

    this.props.fetchData(this.props.selectedMenuId, fil_val);
  }
  onMenuClicked(e) { // when click left menu list
    if(e === "All") this.props.fetchAllData(); // when clicked "All" button
    else this.props.fetchData(e, null) // when clicked categories button
  }
  render() {

    /*-- Category List Section. All categories in the left menu are sorted by ascending order --*/
    const sorted_menu_data = this.state.menuList.slice();
    sorted_menu_data.sort();
    sorted_menu_data.unshift("All"); // view All apps.
    const menu_data = sorted_menu_data.map((item, index) => {
      return <li key={index}><a href="#" key={index} onClick={() => this.onMenuClicked(item)}>{item}</a></li>
    })
    /*-- All categories in the left menu are sorted by ascending order --*/

    /*-- extract 3 apps which have to display by page number --*/
    let tmp = this.props.childList.slice();
    let view_data = [];
    for (let i = 0; i < 3; i++) {
      let pgNum = Number(this.props.page_num);
      if (pgNum === 0) pgNum++;
      if (tmp[i + (pgNum - 1) * 3])
        view_data.push(tmp[i + (pgNum - 1) * 3])
    }
    /*-- extract 3 apps which have to display by page number --*/
    
    /*-- sort by ascending order of the sum of the plans price --*/
    let temp_ary = [];
    for (let i = 0; i < view_data.length; i++) {
      let sum = 0;
      let a = {};
      for (let j = 0; j < view_data[i].subscriptions.length; j++) {
        sum += view_data[i].subscriptions[j].price;
      }
      a.order = i;
      a.sum = sum;
      temp_ary.push(a);
    }
    temp_ary.sort(function (a, b) { return a.sum - b.sum });
    let DataAry = [];
    for (let i = 0; i < temp_ary.length; i++) {
      DataAry.push(view_data[temp_ary[i].order]);
    }
    /*-- sort by ascending order of the sum of the plans price --*/

    /*-- configure app data which display --*/
    let childData = []
    if (view_data) {
      childData = DataAry.map((item, index) => {
        return <Child data={item} category={this.props.selectedMenuId} key={item.id}></Child>
      })
    }
    /*-- configure app data which display --*/

    /*-- configure pageNate data --*/
    const pageCount = Math.ceil(this.props.childList.length / 3);
    const pageSecionData = [];

    for (let i = 0; i < pageCount; i++) {
      const p = <li key={i}><a href="#" key={i} onClick={() => this.onChangePagenation(i + 1)}>{i + 1}</a></li>
      pageSecionData.push(p);
    }
    /*-- configure pageNate data --*/

    return (
      <div className="flex-container">
        <nav className="nav-categories">
          <h2>Categories</h2>

          <ul className="nav-menu">
            {menu_data}
          </ul>
        </nav>
        <section className="apps-list">
          <header>
            <input type="text" placeholder="Search by App" onChange={this.onSearchFiltering} />
          </header>
          {this.props.childList && childData}
          <ul className="pagination">
            <li><a href="#" onClick={() => this.onChangePagenation("left")}>&lt;</a></li>
            {pageSecionData}
            <li><a href="#" onClick={() => this.onChangePagenation("right")}>&gt;</a></li>
          </ul>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    childList: state.fetchDataReducer.fetch_data ? state.fetchDataReducer.fetch_data : [],
    page_num: state.fetchDataReducer.page_num > 0 ? state.fetchDataReducer.page_num : 1,
    selectedMenuId: state.fetchDataReducer.selectedMenuId
  }
}
export default connect(
  mapStateToProps,
  actions
)(App);
