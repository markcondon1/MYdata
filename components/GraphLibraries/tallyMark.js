// default imports
import React, {useEffect, useState, Suspense } from 'react'
import {View,Text, Dimensions,TouchableWithoutFeedback} from 'react-native';
// React-Native-Chart-Kit import; simple graphs
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart,} from "react-native-chart-kit";
// React-Native-Svg import
import Svg, {Circle,Ellipse,G,TSpan,TextPath,Path,Polygon,Polyline,Line,Rect,Use,Image,Symbol,Defs,LinearGradient,RadialGradient,Stop,ClipPath,Pattern,Mask,} from 'react-native-svg';
// Table stuff
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
// Global Variables
import AwesomeAlert from 'react-native-awesome-alerts';
import GLOBAL from "../global.js";
import { Console } from 'console';

// all colors
let backgroundColor="#faf5ef";
let highlight="#63ba83";
let midtone = "#4ea66d";
let dark="#343434";
let warning = "#E07A5F";
let pink="#c740d6";
let red="#d64040";
let yellow="#d6b640";
let green="#4ea66d";
let blue="#438ab0";
let teal="#43b0a9";
let indigo="#6243b0";

let redSlash = "#CC6060";
let yellowSlash = "#DEC466";
let blueSlash = "#68A1BF";

let colorArray=[red,yellow,blue];
let slashColorArray=[redSlash,yellowSlash,blueSlash];

export default class TallyMark extends React.Component {
   //State of the class, data stored in here
   constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showAlert: false,
      alertTitle: "",
      alertMessage: "",
      graphData: [],
    }
  }

  //Called on load
  componentDidMount() {
    this.DataProcessing(this.props.rawData);
  }

  //Called when the data changes and updates the state for the graph
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props || this.state.isLoading) {
      this.DataProcessing(this.props.rawData);
    }
  }

  //Processes the incoming data as needed for the graph
  DataProcessing = (graph) => {
    let dataArray = graph.Data;
    this.quickSort(dataArray, 0, (dataArray.length - 1));

    this.setState({
      isLoading: false,
      graphData: dataArray,
    });
  } 
 
  // Algorithim Implementation modified from : https://www.geeksforgeeks.org/quick-sort/ 
  quickSort = (arr, low, high) => {
    if (low < high) {
      let pi = this.partition(arr, low, high);
      this.quickSort(arr, low, pi - 1);
      this.quickSort(arr, pi + 1, high);
    }
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
  
  swap=(arr,xp, yp)=>{
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
  }

  //Displays additional info when user interacts with graph
  pressHandler = (item) => {
    let description = "Date: " + item.Date.toDateString() + "\nTime: " + item.Date.toLocaleTimeString();
    let button = this.props.rawData.Buttons[item.ButtonID].ButtonName;
    
    this.setState({
      showAlert: true,
      alertTitle: button,
      alertMessage: description,
    });
  }

  render() {
    return (
      <View style={this.props.styles.container}>
        <View style={this.props.styles.border}>
          <GetTallys data={this.state.graphData} pressHandler={this.pressHandler}/>
        </View>
        <Text style={this.props.styles.regularText}> Tap the entries to see more information </Text>
        
        <AwesomeAlert
          show={this.state.showAlert}
          title={this.state.alertTitle}
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

function GetTallys ({data, pressHandler}) {
  let tallys0 = [];
  let tallys1 = [];
  let tallys2 = [];
  let width = Dimensions.get("window").width * .75;
  let height = Math.ceil(data.length / 25)*(width / 6)+85;
  
  let radius = width/40;
  let currentXTally0 = radius;
  let currentYTally0 = radius;

  let currentXTally1 = radius;
  let currentYTally1 = currentYTally0+50;

  let currentXTally2 = radius;
  let currentYTally2 = currentYTally1+50;

  let tallyDivider0 = 0;
  let tallyDivider1 = 0;
  let tallyDivider2 = 0;

  //For each entry, creates a tally mark, with all of them being grouped by button ID
  for(let i = 0; i < data.length; i++){
    if(data[i].ButtonID==0) 
    {
      if(tallyDivider0 != 4) //handles regular tallys
    {
      tallys0.push(<Line key={i} x1={currentXTally0} y1={currentYTally0} x2={currentXTally0} y2={currentYTally0+25} stroke={colorArray[data[i].ButtonID]} strokeWidth={8} strokeLinecap={"round"}/>);
      currentXTally0 += radius * 2;
      tallyDivider0++;
    }
    else //handles cross tally mark
    {
      let arrLength = tallys0.length

      let crossX1 = tallys0[arrLength-4].props.x1;
      let crossX2 = tallys0[arrLength-1].props.x2;
      let crossY1 = tallys0[arrLength-4].props.y1;
      let crossY2 = tallys0[arrLength-1].props.y2;
      
      tallys0.push(<Line key={i} x1={crossX1} y1={crossY1} x2={crossX2} y2={crossY2} stroke={slashColorArray[data[i].ButtonID]} strokeWidth={10} strokeLinecap={"round"}/>);
      tallyDivider0 = 0;
    }
    if(currentXTally0 > width){
        currentXTally0 = radius;
        currentYTally0 += radius*5.5;
        currentYTally1 += radius*5.5;
        currentYTally2 += radius*5.5;
        //Moves all Button 1 tallys down
        for(let j = 0; j < tallys1.length;j++)
        {
          let radTimesEquals = radius*5.5;
          let tempX1 = tallys1[j].props.x1;
          let tempX2 = tallys1[j].props.x2;
          let tempY1 = tallys1[j].props.y1 + radTimesEquals;
          let tempY2 = tallys1[j].props.y2 + radTimesEquals;

          let tempColor = tallys1[j].props.stroke;
          let tempStrokeWidth = tallys1[j].props.strokeWidth;

          tallys1.splice(j,1,<Line key={j} x1={tempX1} y1={tempY1} x2={tempX2} y2={tempY2} stroke={tempColor} strokeWidth={tempStrokeWidth} strokeLinecap={"round"}/>)
        }
        //Moves all Button 2 tallys down
        for(let j = 0; j < tallys2.length;j++)
        {
          let radTimesEquals = radius*5.5;
          let tempX = tallys2[j].props.x1;
          let tempX2 = tallys2[j].props.x2;
          let tempY1 = tallys2[j].props.y1 + radTimesEquals;
          let tempY2 = tallys2[j].props.y2 + radTimesEquals;

          let tempColor = tallys2[j].props.stroke;
          let tempStrokeWidth = tallys2[j].props.strokeWidth;

          tallys2.splice(j,1,<Line key={j} x1={tempX} y1={tempY1} x2={tempX2} y2={tempY2} stroke={tempColor} strokeWidth={tempStrokeWidth} strokeLinecap={"round"}/>)
        }
    }
}
    else if(data[i].ButtonID==1)
    {
      if(tallyDivider1 != 4){ //handles regular tallys
        tallys1.push(<Line key={i} x1={currentXTally1} y1={currentYTally1} x2={currentXTally1} y2={currentYTally1+25} stroke={colorArray[data[i].ButtonID]} strokeWidth={8} strokeLinecap={"round"}/>);
        currentXTally1 += radius * 2;
        tallyDivider1++;
      }
      else //handles cross tally mark
      {
        let arrLength = tallys1.length
  
        let crossX1 = tallys1[arrLength-4].props.x1;
        let crossX2 = tallys1[arrLength-1].props.x2;
        let crossY1 = tallys1[arrLength-4].props.y1;
        let crossY2 = tallys1[arrLength-1].props.y2;
        
        tallys1.push(<Line key={i} x1={crossX1} y1={crossY1} x2={crossX2} y2={crossY2} stroke={slashColorArray[data[i].ButtonID]} strokeWidth={10} strokeLinecap={"round"}/>);
        tallyDivider1 = 0;
      }
    if(currentXTally1 > width){
        currentXTally1 = radius;
        currentYTally1 += radius*5.5;
        currentYTally2 += radius*5.5;
        //Moves all Button2 tallys down
        for(let j = 0; j < tallys2.length;j++)
        {
          let radTimesEquals = radius*5.5;
          let tempX = tallys2[j].props.x1;
          let tempX2 = tallys2[j].props.x2;
          let tempY1 = tallys2[j].props.y1 + radTimesEquals;
          let tempY2 = tallys2[j].props.y2 + radTimesEquals;

          let tempColor = tallys2[j].props.stroke;
          let tempStrokeWidth = tallys2[j].props.strokeWidth;

          tallys2.splice(j,1,<Line key={j} x1={tempX} y1={tempY1} x2={tempX2} y2={tempY2} stroke={tempColor} strokeWidth={tempStrokeWidth} strokeLinecap={"round"}/>)
        }
    }
    }
    else if(data[i].ButtonID==2)
    {
      if(tallyDivider2 != 4){ //handles regular tallys
        tallys2.push(<Line key={i} x1={currentXTally2} y1={currentYTally2} x2={currentXTally2} y2={currentYTally2+25} stroke={colorArray[data[i].ButtonID]} strokeWidth={8} strokeLinecap={"round"}/>);
        currentXTally2 += radius * 2;
        tallyDivider2++;
      }
      else //handles cross tally mark
      {
        let arrLength = tallys2.length
  
        let crossX1 = tallys2[arrLength-4].props.x1;
        let crossX2 = tallys2[arrLength-1].props.x2;
        let crossY1 = tallys2[arrLength-4].props.y1;
        let crossY2 = tallys2[arrLength-1].props.y2;
        
        tallys2.push(<Line key={i} x1={crossX1} y1={crossY1} x2={crossX2} y2={crossY2} stroke={slashColorArray[data[i].ButtonID]} strokeWidth={10} strokeLinecap={"round"}/>);
        tallyDivider2 = 0;
      }
    if(currentXTally2 > width){
        currentXTally2 = radius;
        currentYTally2 += radius*5.5;
    }
    }
  }
  
  return(
    <Svg width={width} height={height}>
      {tallys0}
      {tallys1}
      {tallys2}
    </Svg>
  )
} 