// default imports
import React from 'react';
import {View, Dimensions, Text} from 'react-native';
// React-Native-Svg import
import Svg, {Circle, Path} from 'react-native-svg';
import AwesomeAlert from 'react-native-awesome-alerts';

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
let darkModeColor = "#3b3b3b"; // background color for darkmode
let lightModeColor = "#faf5ef"; // background color for lightmode

// Array of the colors used for each section of the pie chart, in order of the buttons (red, yellow, blue)
let colors = [red, yellow, blue];

 {/* Currently, this graph only works if you have existing data. 
  This graph will not work and will lead to errors if you try to create a *new* donut graph. */}

export default class Donut extends React.Component {
  // doughnut vs donut? Using donut since we're in the United States 🍩

  //State Variables: Initialize any variables that need to be passed to the render here
  //Modify them by calling setState in DataProcessing as needed
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      graphData: [],
    };
  }

  // Called on load and sets the state variables
  componentDidMount() {
    this.DataProcessing(this.props.rawData);
  }

  // Called when the graph data is changed and updates the state variables
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props || this.state.isLoading) {
      this.DataProcessing(this.props.rawData);
    }
  }

  //Processes the data and updates any necessary variables for the render
  DataProcessing = (graph) => {
    let dataArray = graph.Data;
    //Add code to process and manipulate the data here
    //Any additional variables must be included in the set state call
    let dataCounter = [0, 0, 0]; // Initialize a counter for each button

    // Every time a button is pressed, add the button press to a running tally for each button
    for (let i = 0; i < dataArray.length; i++) {
      let buttonID = dataArray[i].ButtonID;
      if (buttonID === 0) {
        dataCounter[0]++; // increment the counter
      } else if (buttonID === 1) {
        dataCounter[1]++;
      } else if (buttonID === 2) {
        dataCounter[2]++;
      }
    }

    // total amount of all button presses, the whole
    let totalCount = dataArray.length;

    let graphData = []; // new array that collects the proportion of each button press relative to the whole + color for each button + count for each button
    for (let i = 0; i < dataCounter.length; i++) {
      let percentage = dataCounter[i] / totalCount; // calculate the proportion of button presses for each button out of all presses
      let color = colors[i];

      graphData.push({
        percentage,
        color,
        count: dataCounter[i], // count for each button
      });
    }

    // setting variables for render
    this.setState({
      isLoading: false,
      graphData: graphData,
    });
  }

  // Modify to Reflect Relevant Information For the User Upon Interacting With the Graph
  // Displays additional info when user interacts with graph
  pressHandler = (buttonID, counter) => {
    let title = `Button ${buttonID}`; // the button ID
    let message = `Button ${buttonID}: Pressed ${counter} times`; // the amount of times the button was pressed

    this.setState({
      showAlert:true,
      alertTitle: title,
      alertMessage: message,
    })
  }

  // If Needed, Create Additional Functions Outside the Main Body
  render() {
    let width = Dimensions.get("window").width * 0.75;
    let height = Dimensions.get("window").height * 0.4;
    let strokeWidth = 40;
    let radius = Math.min(width, height) / 2 - strokeWidth / 2;
    let centerX = width / 2;
    let centerY = height / 2;

    let cumulativePercentage = -Math.PI / 2; // starting location for arcs, at -(π / 2) in unit circle. Can remove the (-) if preferred for aesthetics.
    let arcs = []; // all 3 of the arcs for display

    // determine if the user's device is currently on dark mode or light mode
    // change the color of the doughnut hole to match the device theme 
    let holeColor = this.state.isDarkMode ? darkModeColor : lightModeColor;

    // Check if graphData has values before proceeding
    if (this.state.graphData.length === 0) {
      return;
  } 
  else {
    for (let i = 0; i < this.state.graphData.length; i++) {
      let data = this.state.graphData[i]; // set variable to get each item in the data set, to get color and percentage
      let angle = Math.PI * 2 * data.percentage;

      // calculates positions for each arc
      let x1 = centerX + radius * Math.cos(cumulativePercentage);
      let y1 = centerY + radius * Math.sin(cumulativePercentage);
      let x2 = centerX + radius * Math.cos(cumulativePercentage + angle);
      let y2 = centerY + radius * Math.sin(cumulativePercentage + angle);

      cumulativePercentage += angle; // as the proportion of a button press increases, so does its angle
      let largeArcFlag = angle > Math.PI ? 1 : 0; // determines if the arc should be greater than 180 degrees

      // using SVG path to create an arc, set the coordinates and attributes for each arc
      let path = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      // add each arc to the array of arcs to be displayed
      arcs.push(
        <Path key={i} d={path} fill={data.color} onPress={() => this.pressHandler(i, data.count)} />
      );
    }
  }

    return (
      <View style={{ alignItems: 'center' }}>
        <Svg width={width} height={height}>
          {/*Code to Display Graph Here*/}
          {arcs}
          {/* creates a hole in the middle to create the doughnut */}
          <Circle cx={centerX} cy={centerY} r={radius / 2} fill={holeColor} /> 
        </Svg>
        {/*Alert to Display Further Info on Tap*/}
        {/* When pressing on each arc, the corresponding button's name and its amount of presses will be displayed */}
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