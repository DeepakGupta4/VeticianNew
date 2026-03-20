import { View, Text, StyleSheet } from "react-native";

export default function TodaySummary(){
 return(
  <View style={styles.container}>
   <Text style={styles.title}>Today's Summary</Text>

   <Text>Activity Level: High - Very active</Text>
   <Text>Mood: Happy & playful</Text>
   <Text>Temperature: 101.2°F - Normal</Text>

   <View style={styles.updateBox}>
    <Text>Last Updated</Text>
    <Text>Today at 2:30 PM</Text>
   </View>
  </View>
 )
}

const styles=StyleSheet.create({
 container:{
  backgroundColor:"#EEF2FF",
  margin:16,
  padding:16,
  borderRadius:16
 },
 title:{
  fontWeight:"700",
  marginBottom:10
 },
 updateBox:{
  marginTop:10,
  backgroundColor:"white",
  padding:10,
  borderRadius:10
 }
})