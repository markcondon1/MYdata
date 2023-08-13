// default imports
import React, {useEffect, useState, Suspense } from 'react'
import {View,Text, Dimensions,TouchableWithoutFeedback} from 'react-native';
// standard graph stuff
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart,} from "react-native-chart-kit";
// custom shape stuff
import Svg, {Circle,Ellipse,G,TSpan,TextPath,Path,Polygon,Polyline,Line,Rect,Use,Image,Symbol,Defs,LinearGradient,RadialGradient,Stop,ClipPath,Pattern,Mask,} from 'react-native-svg';
// Table stuff
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
// Global Variables
import GLOBAL from "../global.js";
import AwesomeAlert from 'react-native-awesome-alerts';

let backgroundColor="#faf5ef";
let highlight="#97deb1";
let midtone = "#489c66";
let dark="#343434";
let pink="#c740d6";
let red="#d64040";
let yellow="#d6b640";
let green="#4ea66d";
let blue="#438ab0";
let teal="#43b0a9";
let indigo="#6243b0";

let colorArray=[red,yellow,blue];


export default class ChessClock extends React.Component {
  // State of the class, data stored in here
  // @param: props, the props passed in from the the parent class
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showAlert: false,
      alertTitle: "",
      alertMessage: "",
      graphData: [],
      maxLength: 0,
    }
  }

  // when passed in json changes, this is called
  // updates the state for the graph
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props || this.state.isLoading) {
      this.DataProcessing(this.props.rawData);
    }
  }

  // called on load
  componentDidMount() {
    this.DataProcessing(this.props.rawData);
  }

  // used to manually reload the state
  updateData() {
    this.setState( { isLoading:true } );
  }

  DataProcessing = (graph) => {
    let dataArray = graph.Data;
    this.quickSort(dataArray, 0, (dataArray.length - 1));

    let buttons = graph.Buttons;
    let finalArray = [];
    let maxLength = 0;
    let checked = [];

    for (let i = 0; i < dataArray.length; i++) {
      if (!checked.includes(i)) {
        for (let j = i + 1; j < dataArray.length; j++) {
          let start = dataArray[i];
          let end = dataArray[j];

          if (start.ButtonID == end.ButtonID) {
            let duration = end.Date.getTime() - start.Date.getTime();
            maxLength = Math.max(maxLength, duration);
            finalArray.push({
              ButtonID: start.ButtonID,
              ButtonName: buttons[start.ButtonID].ButtonName,
              Duration: duration
            });

            checked.push(j);
            break;
          }
        }
      }
    }

    this.setState({
      isLoading: false,
      graphData: finalArray,
      maxLength: maxLength,
    });
  }

  swap=(arr,xp, yp)=>{
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
  }

  partition = (arr, low, high) => {
    let pivot = arr[high];
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
      if (arr[j].Date < pivot.Date) {
        i++;
        this.swap(arr, i, j);
      }
    }
    this.swap(arr, i + 1, high);
    return (i + 1);
  }

  quickSort = (arr, low, high) => {
    if (low < high) {
      let pi = this.partition(arr, low, high);
      this.quickSort(arr, low, pi - 1);
      this.quickSort(arr, pi + 1, high);
    }
  }

  whenPressed = (item) => {
    let message = `Button: ${item.ButtonName}\nDuration: ${(item.Duration / 1000).toFixed(3)} seconds`;
    
    this.setState({
      showAlert: true,
      alertMessage: message});
  }

  render() {
    return (
      <View>
        <View style={this.props.styles.container}>
          <View style={this.props.styles.border}>
            <Lines data={this.state.graphData} maxLength={this.state.maxLength} pressHandler={this.whenPressed}></Lines>
          </View>
          <Text style={this.props.styles.regularText}> Press on the lines to see more information </Text>
        </View>

        <AwesomeAlert
          show={this.state.showAlert}
          title={"Data"}
          message= {this.state.alertMessage}
          titleStyle={this.props.styles.alertText}
          messageStyle={this.props.styles.alertBody}
          contentContainerStyle={this.props.styles.alert}
          onDismiss={() => { this.setState({showAlert:false}); }}
        />
      </View>
    );
  }
}

function Lines({data, maxLength, pressHandler}) {
  let toReturn = [];
  let width = Dimensions.get("window").width * .75;
  let height = ((width * .1) * (data.length + 1)) + (data.length * .075);
  let scale = (width * .9) / maxLength;
  let curHeight = width * .1;

  for(let i = 0; i < data.length; i++) {
    let temp = (data[i].Duration * scale) / 2;
    temp = Math.max(temp, 5);
    
    toReturn.push(<Rect key={i} x={width / 2 - temp} y={curHeight - (width * .075)} width={temp * 2} height={width * .075} fill={colorArray[data[i].ButtonID]} onPress={() => pressHandler(data[i])}></Rect>)
    curHeight += width * .1;
  }

  return (
    <Svg width={width} height={height}>
      {toReturn}
    </Svg>
  )
}