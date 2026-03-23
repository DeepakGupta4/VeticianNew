import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useState } from "react";

const width = Dimensions.get("window").width;

export default function WeightChart() {

  const data = {
    labels:["Jan","Feb","Mar","Apr","May","Jun"],
    datasets:[
      {
        data:[45,46,45.5,46.5,47,46.8]
      }
    ]
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Tracking</Text>

      <LineChart
        data={data}
        width={width-64}
        height={220}
        fromZero={false}
        chartConfig={{
          backgroundGradientFrom:"#fff",
          backgroundGradientTo:"#fff",
          color:()=>"#5C9BD5",
          labelColor:()=>"#6B7280"
        }}
        bezier
      />
    </View>
  )
}

const styles = StyleSheet.create({
 container:{
  backgroundColor:"white",
  margin:16,
  padding:16,
  borderRadius:16,
  overflow:"hidden",
 },

 title:{
  fontWeight:"700",
  fontSize:16,
  marginBottom:12
 }
})