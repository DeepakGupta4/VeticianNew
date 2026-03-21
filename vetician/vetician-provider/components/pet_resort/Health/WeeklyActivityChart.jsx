// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
// } from "react-native";

// import { BarChart } from "react-native-chart-kit";
// import { Picker } from "@react-native-picker/picker";

// const screenWidth = Dimensions.get("window").width;

// export default function WeeklyActivityChart() {

//   const [filter, setFilter] = useState("week");
//   const [tooltip, setTooltip] = useState(null);

//   const datasets = {
//     week: {
//       labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
//       steps: [8500,7200,9100,10300,9800,8600,7900],
//       play: [120,160,140,180,150,200,170]
//     },

//     lastWeek: {
//       labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
//       steps: [7000,6900,8800,9200,9100,8500,8100],
//       play: [100,130,120,150,140,160,150]
//     },

//     month: {
//       labels: ["W1","W2","W3","W4"],
//       steps: [54000,61000,59000,65000],
//       play: [900,1100,1000,1200]
//     }
//   };

//   const current = datasets[filter];

//   const chartData = {
//     labels: current.labels,
//     datasets: [
//       {
//         data: current.steps,
//         color: () => "#60A5FA",
//       },
//       {
//         data: current.play,
//         color: () => "#FB923C",
//       }
//     ],
//     legend: ["Steps", "Play Time (min)"]
//   };

//   return (
//     <View style={styles.container}>

//       {/* Header */}

//       <View style={styles.header}>
//         <Text style={styles.title}>Weekly Activity</Text>

//         <View style={styles.filter}>
//           <Picker
//             selectedValue={filter}
//             style={styles.picker}
//             onValueChange={(value) => setFilter(value)}
//           >
//             <Picker.Item label="This Week" value="week" />
//             <Picker.Item label="Last Week" value="lastWeek" />
//             <Picker.Item label="This Month" value="month" />
//           </Picker>
//         </View>
//       </View>


//       {/* Chart */}

//       <BarChart
//         data={chartData}
//         width={screenWidth - 40}
//         height={240}
//         fromZero
//         showBarTops
//         withInnerLines
//         chartConfig={{
//           backgroundGradientFrom: "#ffffff",
//           backgroundGradientTo: "#ffffff",
//           decimalPlaces: 0,
//           color: () => "#60A5FA",
//           labelColor: () => "#64748B",
//           propsForBackgroundLines: {
//             strokeDasharray: "4",
//           },
//         }}
//         style={styles.chart}
//         onDataPointClick={(data) => {
//           const day = current.labels[data.index];

//           setTooltip({
//             day: day,
//             steps: current.steps[data.index],
//             play: current.play[data.index],
//           });
//         }}
//       />

//       {/* Tooltip */}

//       {tooltip && (
//         <View style={styles.tooltip}>
//           <Text style={styles.tooltipDay}>{tooltip.day}</Text>

//           <Text style={styles.steps}>
//             steps : {tooltip.steps}
//           </Text>

//           <Text style={styles.play}>
//             playTime : {tooltip.play}
//           </Text>
//         </View>
//       )}

//       {/* Legend */}

//       <View style={styles.legendRow}>
//         <View style={styles.legendItem}>
//           <View style={[styles.dot,{backgroundColor:"#60A5FA"}]} />
//           <Text>Steps</Text>
//         </View>

//         <View style={styles.legendItem}>
//           <View style={[styles.dot,{backgroundColor:"#FB923C"}]} />
//           <Text>Play Time (min)</Text>
//         </View>
//       </View>

//     </View>
//   );
// }

// const styles = StyleSheet.create({

// container:{
//   backgroundColor:"#fff",
//   margin:16,
//   borderRadius:16,
//   padding:16,
//   elevation:3
// },

// header:{
//   flexDirection:"row",
//   justifyContent:"space-between",
//   alignItems:"center",
//   marginBottom:10
// },

// title:{
//   fontSize:16,
//   fontWeight:"700"
// },

// filter:{
//   borderWidth:1,
//   borderColor:"#60A5FA",
//   borderRadius:10,
//   overflow:"hidden",
//   width:140
// },

// picker:{
//   height:35
// },

// chart:{
//   borderRadius:12
// },

// tooltip:{
//   position:"absolute",
//   top:90,
//   left:"40%",
//   backgroundColor:"#fff",
//   padding:10,
//   borderRadius:10,
//   elevation:4
// },

// tooltipDay:{
//   fontWeight:"700",
//   marginBottom:4
// },

// steps:{
//   color:"#60A5FA"
// },

// play:{
//   color:"#FB923C"
// },

// legendRow:{
//   flexDirection:"row",
//   justifyContent:"center",
//   marginTop:10,
//   gap:20
// },

// legendItem:{
//   flexDirection:"row",
//   alignItems:"center",
//   gap:6
// },

// dot:{
//   width:10,
//   height:10,
//   borderRadius:5
// }

// });

import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export default function WeeklyActivityChart() {

  const [filter, setFilter] = useState("week");

  const datasets = {
    week: [
      { label: "Mon", steps: 8500, play: 120 },
      { label: "Tue", steps: 7200, play: 160 },
      { label: "Wed", steps: 9100, play: 140 },
      { label: "Thu", steps: 10300, play: 180 },
      { label: "Fri", steps: 9800, play: 150 },
      { label: "Sat", steps: 8600, play: 200 },
      { label: "Sun", steps: 7900, play: 170 },
    ],

    lastWeek: [
      { label: "Mon", steps: 7000, play: 100 },
      { label: "Tue", steps: 6900, play: 120 },
      { label: "Wed", steps: 8800, play: 110 },
      { label: "Thu", steps: 9200, play: 150 },
      { label: "Fri", steps: 9100, play: 140 },
      { label: "Sat", steps: 8500, play: 160 },
      { label: "Sun", steps: 8100, play: 150 },
    ],

    month: [
      { label: "W1", steps: 54000, play: 900 },
      { label: "W2", steps: 61000, play: 1100 },
      { label: "W3", steps: 59000, play: 1000 },
      { label: "W4", steps: 65000, play: 1200 },
    ]
  };

  const current = datasets[filter];

  const stepBars = current.map((item) => ({
    value: item.steps,
    label: item.label,
    frontColor: "#60A5FA",
    spacing: 6,
  }));

  const playBars = current.map((item) => ({
    value: item.play,
    frontColor: "#FB923C",
  }));

  const combinedData = [];

  for (let i = 0; i < current.length; i++) {
    combinedData.push(stepBars[i]);
    combinedData.push(playBars[i]);
  }

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.title}>Weekly Activity</Text>

        <View style={styles.filter}>
          <Picker
            selectedValue={filter}
            onValueChange={(value) => setFilter(value)}
          >
            <Picker.Item label="This Week" value="week" />
            <Picker.Item label="Last Week" value="lastWeek" />
            <Picker.Item label="This Month" value="month" />
          </Picker>
        </View>
      </View>


      {/* Chart */}

      <BarChart
        data={combinedData}

        barWidth={16}
        spacing={8}

        roundedTop

        adjustToWidth

        height={220}

        hideRules={false}

        yAxisThickness={0}
        xAxisThickness={0}

        maxValue={12000}

        noOfSections={5}

        showYAxisIndices
        renderTooltip={(item) => (
          <View style={styles.tooltip}>
            <Text style={{ fontWeight: "600" }}>
              {item.label ?? ""}
            </Text>
            <Text style={{ color: "#60A5FA" }}>
              steps : {item.value}
            </Text>
          </View>
        )}
      />


      {/* Legend */}

      <View style={styles.legendRow}>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#60A5FA" }]} />
          <Text>Steps</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#FB923C" }]} />
          <Text>Play Time (min)</Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 4
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },

  title: {
    fontSize: 16,
    fontWeight: "700"
  },

  filter: {
    borderWidth: 1,
    borderColor: "#60A5FA",
    borderRadius: 10,
    width: 150
  },

  tooltip: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    elevation: 4
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6
  }

});