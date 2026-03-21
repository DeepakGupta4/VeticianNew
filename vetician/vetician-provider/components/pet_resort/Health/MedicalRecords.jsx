import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Medications(){

 return(
  <View style={styles.container}>
   <Text style={styles.title}>Active Medications</Text>

   <View style={styles.card}>
    <Text style={styles.name}>Heartgard Plus</Text>
    <Text>One chewable monthly</Text>
    <Text>Next due: Mar 12</Text>
   </View>

   <View style={styles.card}>
    <Text style={styles.name}>NexGard</Text>
    <Text>One tablet monthly</Text>
    <Text>Next due: Mar 18</Text>
   </View>

   <TouchableOpacity style={styles.button}>
    <Text style={{color:"white"}}>Add Medication</Text>
   </TouchableOpacity>

  </View>
 )
}

const styles=StyleSheet.create({
 container:{margin:16},
 title:{fontWeight:"700",marginBottom:10},
 card:{
  backgroundColor:"white",
  padding:14,
  borderRadius:12,
  marginBottom:10
 },
 name:{fontWeight:"600"},
 button:{
  backgroundColor:"#5C9BD5",
  padding:14,
  borderRadius:12,
  alignItems:"center"
 }
})