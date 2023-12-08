import React from 'react'
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";


let backgroundColor="#faf5ef";
let highlight="#63ba83";
let midtone = "#4ea66d";
let dark="#343434";
let warning = "#E07A5F";
let red="#d64040";
let blue="#438ab0";
let yellow="#d6b640";
let colorArray=[red,yellow,blue];


const chartConfig = {
 backgroundGradientFrom: backgroundColor,
 backgroundGradientFromOpacity: midtone,
 backgroundGradientTo: backgroundColor,
 color: (opacity = 1) => `rgba(52, 52, 52, ${opacity})`,
 strokeWidth: 10,
 decimalPlaces: 0,
 style: { borderRadius: 16 },
}


export default class PieGraph extends React.Component {
 // State of the class, data stored in here
 constructor(props) {
   super(props);
   this.state = {
     isLoading: true,
     graphData: [],
   }
 }


 // Called on load
 componentDidMount() {
   this.DataProcessing(this.props.rawData);
 }


 // Called when the data changes and updates the state for the graph
 componentDidUpdate(prevProps, prevState) {
   if (prevProps !== this.props || this.state.isLoading) {
     this.DataProcessing(this.props.rawData);
   }
 }


 // Processes the incoming data as needed for the graph
 DataProcessing = (graph) => {
   let dataArray = graph.Data;
   this.quickSort(dataArray, 0, (dataArray.length - 1));


   // Prepare data for the PieChart
   let graphData = [];
   for (let i = 0; i < graph.Buttons.length; i++) {
       let color = colorArray[i % colorArray.length];
       graphData.push({
           name: graph.Buttons[i].ButtonName,
           count: 0,
           color: color,
           legendFontColor: `rgba(52, 52, 52, 1)`,
           legendFontSize: 15,
       });
   }


   for (let i = 0; i < dataArray.length; i++) {
     graphData[dataArray[i].ButtonID].count++;
   }


   this.setState({
     isLoading: false,
     graphData: graphData,
   });
 }


 // Algorithm Implementation modified from: https://www.geeksforgeeks.org/quick-sort/
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


 swap = (arr, xp, yp) => {
   var temp = arr[xp];
   arr[xp] = arr[yp];
   arr[yp] = temp;
 }


 render() {
   return (
     <View style={this.props.styles.container}>
       <View style={this.props.styles.border}>
         <PieChart
           data={this.state.graphData}
           width={Dimensions.get("window").width * 0.7}
           height={Dimensions.get("window").height * 0.3}
           chartConfig={chartConfig}
           accessor="count"
           backgroundColor="transparent"
           paddingLeft="10"
         />
       </View>
     </View>
   );
 }
}

