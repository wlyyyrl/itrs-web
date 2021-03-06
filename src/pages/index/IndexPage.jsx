import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Carousel } from 'antd';
import { ItrsDictionaryApi, ItrsDemandApi } from '../../api/ItrsApi';
import { urlFunctions } from '../../helpers';
import './IndexPage.css';

const { Component } = React;

class LeftWaterfall extends Component {

  state = {
    data: []
  }

  componentDidMount() {
    ItrsDictionaryApi.getPositions(
      (successResult) => {
        if (successResult.success) {
          const data = successResult.data;
          this.setState({ data: data });
        } else {
          console.error(successResult);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleMenuClick(item) {
  }

  render() {
    const menuList = [];
    const data = this.state.data;
    for (var i in data) {
      const parentPosition = data[i];
      const subTypes = parentPosition.subTypes;
      const subMenus = [];

      for (var j in subTypes) {
        const subPosition = subTypes[j];
        subMenus.push(
          <Menu.Item key={ subPosition.id }>
            <Link to={ urlFunctions.queryDemandUrl({ positionType: subPosition.id }) } className="job-name-container">{ subPosition.chineseName }</Link>
          </Menu.Item>
        );
      }

      const parentMenu = (
        <Menu.SubMenu key={ parentPosition.id } title={
          <Link to={ urlFunctions.queryDemandUrl({ positionType: parentPosition.id }) } className="job-name-container">
            <span className="job-cn-name">{ parentPosition.chineseName }</span>
            <span className="job-en-name">{ parentPosition.englishName }</span>
          </Link>
        }>
          { subMenus }
        </Menu.SubMenu>
      );

      menuList.push(parentMenu);
    }
  
    return (
      <div className="left-waterfall">
        <Menu onClick={ this.handleMenuClick } subMenuOpenDelay={ 0.07 } style={{ width: '100%', height: '100%' }} mode="vertical" selectable={ false }>
          { menuList }
        </Menu>
      </div>
    );
  }
}

class IndexPage extends Component {
  
  render() {
    return (
      <div className="index-page">
        <div className="carousel">
          <Carousel autoplay infinite >
            <div>
              <div className="picture" style={{ background: 'url("/assets/bg.png")' }}>
                <div className="page-content"><h3>1</h3></div>
              </div>
            </div>
            <div>
              <div className="picture" style={{ background: 'url("/assets/bg2.png")' }}>
                <div className="page-content"><h3>2</h3></div>
              </div>
            </div>
          </Carousel>
        </div>
        <div className="over-carousel page-content">
          <LeftWaterfall />
          <div className="right-waterfall">
            <h2>最热职位</h2>
            <RightWaterfall/>
          </div>
        </div>
      </div>
    );
  }
}

class RightWaterfall extends Component {
  state = {
    data : []
  }

  componentDidMount() {
    ItrsDemandApi.getNew(
      (successResult) => {
        if (successResult.success) {
          const data = successResult.datas;
          this.setState({ data: data });
        } else {
          console.error(successResult);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  render() {
    const newDemandList = [];
    const newDemandData = this.state.data;
    for (let i in newDemandData) {
      const newDemand = newDemandData[i];
      const newDemandTitle = newDemand.jobName + " - " + newDemand.departmentName;
      newDemandList.push(                
      <li className="job-description" key={ newDemand.id }>
        <Link to={ urlFunctions.queryDemandUrl({ positionType: newDemand.positionType, id: newDemand.id }) } title={ newDemandTitle }>{ newDemandTitle }</Link>
      </li>)
    }
    return (
      <ul className="jobs">
        { newDemandList }
      </ul>
    );
  }
}

export default IndexPage;
