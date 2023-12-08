import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Svg, Circle, Line, Polygon} from 'react-native-svg';
import AwesomeAlert from 'react-native-awesome-alerts';


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
let colorArray=[red,yellow,blue];




export default class Constellation extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    isLoading: true,
    showAlert: false,
    alertTitle: "",
    alertMessage: "",
    graphData: [],
    dotPositions: [],
  };
}




componentDidMount() {
  this.DataProcessing(this.props.rawData);
}


componentDidUpdate(prevProps, prevState) {
  if (prevProps !== this.props || this.state.isLoading) {
    this.DataProcessing(this.props.rawData);
  }
}


DataProcessing = (graph) => {
  let dataArray = graph.Data;
  this.quickSort(dataArray, 0, (dataArray.length - 1));




  let newDotPositions = this.state.dotPositions.slice();
  for (let i = newDotPositions.length; i < dataArray.length; i++) {
    newDotPositions[i] = this.generateRandomPosition();
  }




  this.setState({
    isLoading: false,
    graphData: dataArray,
    dotPositions: newDotPositions,
  });
};


generateRandomPosition = () => {
  const width = Dimensions.get("window").width * 0.75;
  const radius = 10;
  const yIncrement = 30;
  const lastDotIndex = this.state.dotPositions.length - 1;
  let randomX = Math.random() * (width - radius * 2) + radius;
  let newY;


  if (lastDotIndex >= 0) {
    newY = this.state.dotPositions[lastDotIndex].y + yIncrement;
  } else {
    newY = radius; // Starting position for the first dot
  }


  return { x: randomX, y: newY };
};




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
        <GetDots data={this.state.graphData} pressHandler={this.pressHandler} dotPositions={this.state.dotPositions}/>
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




function GetDots({data, pressHandler, dotPositions}) {
 let lines = []; // Array to hold line elements
 let dots = []; // Array to hold dot elements
 const width = Dimensions.get("window").width * 0.75;
 const height = Math.ceil(data.length / 2) * (width / 5); // Adjust as needed
 const radius = 10;


 for (let i = 0; i < data.length; i++) {
   const position = dotPositions[i];
   if (position) {
     // Add line to the previous dot (if this is not the first dot)
     if (i > 0) {
       const previousPosition = dotPositions[i - 1];
       lines.push(
         <Line
           key={`line-${i}`}
           x1={previousPosition.x}
           y1={previousPosition.y}
           x2={position.x}
           y2={position.y}
           stroke="black"
           strokeWidth="1"
         />
       );
     }


     // Add dot
     dots.push(
       <Circle
         key={`dot-${i}`}
         cx={position.x}
         cy={position.y}
         r={radius}
         onPress={() => pressHandler(data[i])}
         fill={colorArray[data[i].ButtonID % colorArray.length]}
       />
     );
   }
 }




return (
  <Svg width={width} height={height}>
    {lines}
    {dots}
  </Svg>
);
}

