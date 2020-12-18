import './../App.css';
import { connect } from 'react-redux';
import * as actions from './../actions';
import React, { Component } from 'react';

class Child extends Component {
    constructor(props) {
        super();

        this.state = {
        }
    }

    render() {
        
        let priceData = [];
        let categoryData = "";
        if(this.props.data){
            const categoryList = this.props.data.categories;
            categoryList.sort();
            for(let i = 0; i < categoryList.length; i++) {
                if(i === 0) categoryData = categoryList[i];
                else categoryData += "/" + categoryList[i];  
            }
            priceData = this.props.data.subscriptions.map((item, index) => {
        
            return  <li key={index}><span>{item.name}</span> <h3>{item.price === 0 ? "Free" : item.price}<sup>{item.price === 0 ? "" : "€"}</sup></h3></li>
        })}
        return(
            <ul>
                <li>
                    <div className="app-item">
                        <div className="box-info">
                            <div className="box-info--content">
                                <div className="description">
                                    <h1>{this.props.data && this.props.data.name}</h1>
                                    <p>{this.props.data && this.props.data.description}</p>
                                </div>
                                <div className="tags"><span>{categoryData}</span></div>
                            </div>
                            <div className="box-info--footer">
                                <ul>
                                    {priceData}
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        )}
}

export default connect(
    null,
    actions
)(Child);
